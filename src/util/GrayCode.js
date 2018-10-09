export default function iterator(initial=0, bits=2)
{
  const string = initial.toString(2).padStart(bits, '0');
  const input = string.split('');

  let index = -1;
  return {
    next: function() {
      if (index < 0) return {
        value: string,
        done: ++index >= 1 << bits
      };

      const i = input.length - (index % input.length) - 1;
      input[i] = input[i] == '0' ? '1' : '0';

      return {
        value: input.join(''),
        done: ++index >= (1 << bits)
      };
    },
    [Symbol.iterator]: function() { return this }
  };
};
