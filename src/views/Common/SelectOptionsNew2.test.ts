// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SelectOptionsNew2 from './SelectOptionsNew2.vue';

const defaultOptions = [
  { key: 1, label: 'Option A', value: 'a' },
  { key: 2, label: 'Option B', value: 'b' },
];

function createWrapper(initialValue: string = '') {
  const wrapper = mount(SelectOptionsNew2, {
    props: {
      modelValue: initialValue,
      label: 'Test Label',
      options: defaultOptions,
      enableOthers: false,

      // see vue-test-utils docs for details on how to treat v-model in tests
      'onUpdate:modelValue': e => wrapper.setProps({ modelValue: e })
    }
  });

  return wrapper;
}

describe('SelectOptionsNew2', () => {
  it('passes updated modelValue to ElSelect when prop changes', async () => {
    const wrapper = createWrapper('a');
    const select = wrapper.findComponent({ name: 'ElSelect' });

    // Initial value
    expect(wrapper.props('modelValue')).toBe('a');

    // Parent → Child: change from parent updates child
    await wrapper.setProps({ modelValue: 'b' });    
    expect(select.props('modelValue')).toBe('b');
  });

  it('emits update:modelValue on user selection', async () => {
    const wrapper = createWrapper('');
    const select = wrapper.findComponent({ name: 'ElSelect' });

    expect(select.exists()).toBe(true);
    expect(wrapper.props('modelValue')).toBe('');

    // Simulate user selecting option 'b' in ElSelect
    await select.setValue('b');

    // Verify emit was called with correct value
    const emitted = wrapper.emitted('update:modelValue') as string[][];
    expect(emitted).toBeTruthy();
    expect(emitted[emitted.length - 1][0]).toBe('b');

    // Verify prop was updated
    expect(wrapper.props('modelValue')).toBe('b');
  });
 
});
