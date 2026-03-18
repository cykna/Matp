# matp

## Matp - Minecraft Addons Transfer Protocol

Terms:
	Datagram: The binary content being sent via scriptevent
	Content: Data send specifically to one End
	End: An addon that can receive content

## 1. Basics
#### 1.1 IDs
When sending data from one addon to another, this one must contain some kine of id used to get track the sender and the one expected to receive the content. This Id should fit in 3 Bytes and generated on entrance on the world, in this way, the ids can and will be randomic, but yet, able to be known by every other addons. How the 3 bytes Id are generated doesn't need to be known, only the final "address". Then, the sharing of IDs to generate address and the way to generate them is not part of this protocol but, addons MUST have a way to know ahead of time how to generate others addons addresses to be able to communicate, this can be on their API specification, a hardcoded value or whatever. The default implementation that an implementor may follow is to use CRC16 to generate these addresses, but not obligatory as long as others know it's ID.
The address will be part of the content sent, since this is for minecraft and using scriptevent calls, the ID of a message is follows as b"matp:"[SENDER][CONTENT], where SENDER is a 3 byte address.
#### 1.2 Datagram packing
When sending the data we will want to read/write data in binary, but minecraft only supports strings, so implementors MUST convert a Datagram to Utf16 string by packing each 2 bytes into 1 char, and the same way when receiving a Datagram, they MUST be able, but not obligatory to, read it as a packed byte array.
The focus of this protocol is to send data to other addons in a reliable way evicting the less amount of scriptevent calls possible. For so, the default max Datagram size is of 8Kb, but each connection may be able to send more if all the targets agree with so on a multitarget message, or if the specific target agrees on a single target one.

#### 2 Handshake
When an addon initializes, it might be able to request a handshake to another one, this is made using Handshake Datagrams.
These are normal datagrams that as specificed to determine the handshake of ends. To initialize the content, a client sends it's data to the target, if after a certain time, this choosen by the client, no response was given, the handshake fails and a NoTarget error is returned. 
On the handshake encrypted data is sent, the function to do so must be based on both end IDs to share the initial contents safely. The methods are talked better on 6.
The handshake MUST contain TransferParameters which includes the maximum Datagram size accepted, the key the sender will use to send more encrypted data later. Talked better on 4.2.
When the receptor receives this content, it sends back it's data and the handshake is stablished where each addon knows the parameters of each other.
When failing the handshake, if so, an addon MUST be able to try again about N times, then, a Retry header will have the same as before.
The handshake between 2 ends can be seen as:

Client ----> [Server1,Server2,Server3]
Client <---- [Server1,Server2,Server3]

Where maybe Server2 does not send data, that can be represented like:

Client <---- [Server1,Server3]

This might and will generate multiple responses to the client, and this is inteended, since the client MUST know or implement a way to handle multiple responses at a time, which can be handled separatedly with promises.

#### 3 Headers
On sending the data, a Content, it will contain some information about the contents inside them. We can imagine this as a Box with a huge amount of letters, eache letter has it's contents.
A dragram will have it's header as the following:
[1Bit:MultipleTarges][7Bit:Unused][4Bytes:Sender]

The MultipleTargets bit determines if the payload is sent to more than a single end at once.

The Content, is equivalent to the letter said before. It will have information about who the data is being sent to, as well as more information about the content itself, such as flags and the data.
By this it can be understood as [1Bit:IsHandshake][7Bit:Unused][4Bytes:Receiver]
The IsHandshake bit determines if the content being sent is used to stablish a handshake.
The Receiver bytes determines who this is being sent to.

On the receiver side, if some header determines if it's encrypted or compressed, the other side must know how to decrypt and/or decompress the content sent. The order MUST be Compression -> Encryption, and compression SHOULD be used only and only when some Frame size is >2kb to not generate too much work. This is not obligatory, but an recommendation an implementor can ignore. 
#### 4 Frames
Frames on MATP are values that can be shared between one end to another, then we understand them as the read content that will be sent. Note that as they are one end to another, the values in here are at connection level, so no a client should not break another one, as theyre seem as independents.
Each Frame has an type, then, a frame can be understood as:
[4Bit:Type][4Bit:ReservedForType][PerTypePayload]
The Type determines the type of the frame.
The 4 bits are reserved for type that may content data in size of 4 bits.
### 4.1 Types:
#### 4.1.1:Ping:
Of Type 1, is used to send data and track if the other addon is still receiving data. No Payload and ReservedForType is unused.

####4.1.2:Crypto:
Of type 2, is used to send data used specifically to determine data about cryptography ajd parameters. These must be encrypted always with the data provided on the handshake, the only case when not, is during the handshake it self.
		New values that determine how data is encrypted will be sent, so if a Client sends a new key, the server adopts it and on responses uses that new key to encrypt data.
		Can be seen as: [4Bit=2][1Bit:FIN][1Bit:Encrypted][2Bit:TypeOfData][VarID:ID][VarID:Length][Length:Payload]
		The Encrypted Bit must be 1 if the header it is at is 1 as well, and MUST be 0 only at handshakes.
		The Fin bit determines if this Frame contains all the data required to finalize. If not, the contents are enqueued until it arrives until timeout.
		TypeOfData determines the type of data being sent: 0 for Keys, 1 for Transferation Parameters, 2 for content and 3 used later. On receiving a Key, it's understood that the one requesting the handshake already had established a connection before. So, if no NoKey error is received, then the sender confirmed the key and established the connection.
		A Crypto frame with Transport parameters MUST be sent without any kind of fragmentation
#### 4.1.3: Data:
This is used to send data to one end to another, not necessarily to send encrypted data.
		Can be visualized as: [4Bit=3][1Bit:FIN][1Bit:Encrypted][2Bit:Compression][VarID:ID][VarID:Length][Length:Payload]
		The FIN bit determines weather this is the last content that was sent
		The encrytped bit determines if the content was encrypted, if so, uses the key between both ends
		The Compression bits determine the type of compression
#### 4.1.4: CloseConnection:
Used only to determine that the connection is being ended with some aditional data.
		[4Bit=4][1Bit=Encrypted][3Bit:Content][VarID:Length][Length:Payload][VarID?:Length2][Length2?:Payload2]
		Encrypted determines if the content is encrypted, MUST be 1 if the header determines so.
		Content determines the kind of content being sent. Its a bitflag with tje following types: 
			1 NewKey, used for both ends on new connection stablishment, so on next handshake both will use the provided key. 
requesting the handshake already had established a connection before. So, if no 2 Reason, a message containing the reason it ended. NoKey error is received, then the sender confirmed the key and established the connection.
			4: Transfer Parameters
		The order on bytes is defined respectively to how they're listed on here, so on a 0b111, NewKey, Reason, TransferParameters will be sent in this order. 
		[VarID:KeyLen][KeyLen:Key][VarID:MsgLen][MsgLen:Reason][Parameters]
	BusyFrame: 5
	    Sent Specifically to tell A target to wait this end to finalize so it can send dsta again. The end waiting here.
	    [Type=5][4Bit=MinTickAmount]
	    MinTickAmount is the minimum time in Ticks this end is requesting the receiver to wait before sending data. Note that the value is WaitBase*N
	SendBack: 6
		Used to tell the receiver that it can start send back new contents for the sender. Normally provided after a BusyFrame.
	LostData: 7
	    Used to tell an end thst the content of the message with the given id was lost and it might send it back
	    [Type=7][4Bits:MaxWaitTicks][ID:VarID]
	    MaxWaitTicks is used to track the amount of ticks this peer will wait for a resend until it simply ignores all the content lost, if there was some, the formula is: WaitBase*MaxWaitTicks.
	    ID is the ID of the message sent, so the end must resent the content back.
	    If the time expires, a LostMessage error is sent back and the sender of the LostMessage error will increase it's error count for tje receiver, if it exceeds MaxLostFrame, then the connection is closed as talked on 5
	 Cache 8:
	     Cache frames follow the same rules as Content, but they differ because they got Key with them. This Key is a numeric value to determine which resposne to use. This is used to do not need to recalculate things over and over. The key os 2 byte. The actual value of the key is 12bits, leading to 4092 possibilities, and the last 4bits are used to track how many ticks it will be accepted. After that, that key with that given slot is freed and opened to another one to use.
	     Can be seen as:
	     [4Bit=8][1Bit:FIN][1Bit:Encrypted][2Bit:Encrypted][2Byte:CacheKey][VarID:Length][Length:Payload]
	     Both ends MUST keep track of the cache, the sender(of the response) in case, MUST get track only the Key, so it can know if the contents can be cached with that key or not.
	     The receiver(of the response) MUST keep track of the cache key, and the content, so it do not resend dsta over and over again, in fact, don't rven send data
	     
	 Error 15
	     The Hsb must be 1 to determine if its an error. If so, the others 3 bits determine the type of the error as discussed on 5
	     [4Bit=15][1Bit:ContainReason][3Bit:ErrorType][VarId:Len][Len:Reason]
	     More talked in 5. The reason is a non encrypted text containing non Internal data about the error and its reason.
		
### 4.2 Transfer Parameters:
Transport parameters are values used to both connections to agree with. A Transport parameter will be sent on crypto frames, and will be as the following:
    [1Bit:Key][1Bit:MaxContentLength][1Bit:MaxDataPerDatagram][1Bit:WaitBase][4Bit:Unused][32Bytes:Key][2Bytes:MaxContentLength][4Bytes:MaxDatagramSize][1Byte:WaitBase]
    The first byte defines flags. If Key, then theres key, same for others.
    Key determines The that public key the sender will use. The receiver will use the provided key to calculate the shared key and then send back the public key, so the next encrypted content will be made using the shared key
    MaxContentLength is the max of contents the end can receive and keep processing while in queue. This must be global and used to avoid that a client talking to other servers receive too much responses. A client will have a queue of responses, if its full, thus, the size is equal to this MaxContentLength, on receiving new responses, it will send back a BusyFrame, telling the server to stop sending the client until a SendBack frame is received. The packet isn't lost, but new ones after the BusyFrame will be
    MaxDataPerDatagram: Determines how many Data can be accepted on a datagram, including the datagram headers, on exceeding so, the content is lost. This value can be used to divide the contents safely. The default is 8kb, so if some receives more than so, it will be ignored
    WaitBase: On sending a BusyFrame, the number in ticks needed be awaited, as well as any other timeout value, will be WaitBase^M, so the one requesting for waits will be able to process dsta correctly. The default for both ends on this one is 2. Note thst even without it being transferred, this is still 2 by default.
    
    
### 5 Errors
NoTarget: 1, Used to determine when an addon tried to establish a connection with another one but this one did not respond, then the addon is not present. Can be used on addons that contains some dependency on another one

NoKey: 2, Error used when stablishing a handshake between a client to a server where the client did think the server had established a connection before and stored the key but hasnt, such as on an addon that depends on 2 others, sends them the data, is updated and now depends on 3. It will generste a NoKey error on the world, since it provided the keys to the other ones and is using so as a base.

InvalidFrame: 3, Errors sent when some Datagram is sent in a wrong manner.

LostMessage: 4, An Error to determine when a content was lost because of it beint out of order or not agreeing with the transport parameters. If the amount of LostMessages from one end exceeds the MaxLostFrame, the connection is closed telling the reason and a key if this one wants to restablish the connection, this is to don't waste unecessary proccessment time.


### 6. Encrypting Methods
By now any kind of encrypting is used with ChaCha20. For things that must have a length, the length is based on the content already encrypted.
When sending some crypto for transfer parameters, the first one might not be encrypted, if the first time joining the world. But later all the contents sent in crypto frames must be encrypted with the key both ends know. The same is valid for any other kind of frame that contains payload and can be encrypted.
The addon will use ECDH curve25519 to share the keys. After finalizing the handshake, the shared key is used as key for encrypting the content.
The visualization of so can be understood as:

Client ---Crypto---> Server
Client <--Crypto---- Server

Where the crypto is a Crypto frame used for so. If the crypto sent is a Key one, the handshake is completed on a single sent. This is made to suppose that both ends know each other parameters

### 7. Compression Methods.
When sending some data, specifically Content frames, this data, can be and depending on the size, is prefered to be compressed, but in general it begins with 2kb of data. In general 2 bits, are used to determine the type of the compression, as talked in 4.1.3, this rule will apply to every other frames.
A encryption of value 0 will be None, thus, no encrypting was made.
One of valur 1 will use Gzip. One of value 2 will use Lz4. And of valur 3 is unused. 

### 8. VarIDs
IDs are values with 15 to 31 bits of length, in case 2 or 4 bytes, where the first bit determines if they're 2bytes or not. In fact they are 2 or 4 bytes, but the actual value used to determine the number value is 15 and 31 bits. This is used for not losing bytes and only send values when really required. 
They can be used for IDs or Lengths.

### 9. Timeout:
Timeouts are calculated on ticks. They can be used with the WaitBase parameter and the provided value by a BusyFrame. 
The default timeout for a Handshake that fails is about 5 ticks, but is configurable per End, so on attempting and failing, ot might wait the amount of Ticks it configured. This means that on failing to establish a handshake, by default that end will wait 5 ticks before retrying it.

### 10. Messaging
On a Message that is multitarget, the way to determine which content is to who, is on looking on the ID of the message, the idea is to it to be in order of contents, so "matp:ID1ID2" on the payload will be [SenderID, Header, Length, PayloadForID1, Length PayloadForID2], where the MsgID is an VarID used to get track the id of tje message sent to that addon.
This is the core idea for both handshakes, and normal messaging.
When a single target message is sent, the same idea os applied,  but the header of the content will determine if its multi or single targeted, thus, it will be understood as a message of type: "matp:TARGETID" whose content is [SenderID, Header, Payload]
Note that to reach so, an End must be able to enqueue the contents before sending them, thus, flushing it. 
A datagram Id can be seen as
[5chars:matp:][VarID:Len][2Bytes:TargetLen][4bytes:ID1][VarID:PositionOnDatagram][4Bytes:ID2][VarID:PositionOnDatagram]...
The max limit the datagram can have, theoretically is 65kb, even though the default on this specification is 8kb.
The 'Len' is the length in bytes the datagram has. In case, this is literally the amount of bytes, not chars on the message being received. The sender must specify the length of the datagram being sent in Bytes, because on using packing data, for example, Base32767, the amount of bytes being sent cannot be known if not decoding, so this is for evicting for decoding only to discard the content
The 'TargetLen' is used simply to track how many targets are receiving the content. 
So the value of PositionOnDatagram is an by default a u16 value, but can be able to be to be more to handle datagrams whose size is bigger than 65kb. Implementors are not obligated to implement so, the only thing is that the value must be a VarID.
The limit is theoretically 65kb because if using 2 bytes, as the PositionOnDatagram uses the first bit to determine the size, it will be able to handle only 32kb with 2bytes.
If the PositionOnDatagram exceeds the value permitted by the end defined on TransportParameters, the packet is lost as defined on MaxDataPerDatagram
