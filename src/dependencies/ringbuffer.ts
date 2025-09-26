/** A Ring buffer with a power of 2 size */
export class RingBuffer<T> {
  private buffer: Array<T>;
  private readonly cap: number;
  private write_idx = 0;
  private read_idx = 0;
  protected size: number;
  constructor(size: number) {
    if (size > 0 && (size & (size - 1)) != 0) throw new Error("Size must be a power of 2");
    this.cap = size - 1;
    this.buffer = new Array(size);
    this.size = 0;
  }

  /** Inserts the given `value` at the end of this buffer. If it would overflow, doesn't push and returns and error with the value back */
  push(value: T): boolean {
    if(this.size <= this.cap) {
      this.buffer[this.write_idx++] = value; this.size++;
      return false;
    }
    return true;
  }

  /** Gets the value on the provided `index` returning to the start if it overflows. This is circular so a RingBuffer of capacity 4, being indexed at 20, will have its values mapped in range of 0..3.*/
  get_at(index: number): T | undefined {
    return this.buffer[index & this.cap];
  }

  /** Push the given `value` in a circular way, if the content would overflow, then it will be written from the start.*/
  push_circular(value: T): T | undefined {
    const next = this.write_idx + 1 & this.cap;
    const old = this.buffer[this.write_idx];
    this.buffer[this.write_idx] = value;
    this.write_idx = next;
    if(this.size <= this.cap) ++this.size;
    return old;
  }

  /** Retrieves how many elements this buffer can handle */
  capacity() {
    return this.cap + 1;
  }
  /** Retrieves how many elements were written on this buffer*/
  length() {
    return this.size;
  }
  /** Retrieves the value on the front. Note that calling this on a for loop might cause an infinite loop since this goes back to the beggining on reaching the end */
  pop_front(){
    const data = this.buffer[this.read_idx++];
    this.read_idx &= this.cap;
    this.size--;
    return data;
  }
  /** Retrieves the last element of the buffer and removes it*/
  pop_back(){
    this.write_idx--;
    this.write_idx &= this.cap;
    this.size--;
    return this.buffer[this.write_idx];
  }
  /** Retrieves an iterator over all the elements on this Buffer */
  *iter(){
    yield* this.buffer;
  }
  /*Retrieves an iterator that dequeues the values on iterating. Note that it only iterates until the written values.
  Even though this is a ring buffer, it only yields until the size. If some was popped, then it won't be shown*/
  *drain(){
    while(this.read_idx < this.size) {
      yield this.buffer[this.read_idx++];
    }
    this.read_idx = 0;
  }
}
