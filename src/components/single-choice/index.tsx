/* @jsxImportSource vue */
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SingleChoice',
  props: {
    options: {
      type: Array as () => Array<{ label: string, value: any }>,
      required: true,
    },
    modelValue: {
      type: [String, Number, Boolean],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'image-click'],
  setup(props, { emit }) {
    const selectedValue = ref(props.modelValue)

    const handleChange = (value: any) => {
      if (props.disabled)
        return
      selectedValue.value = value
      emit('update:modelValue', value)
    }
    const parseFormula = (formula: string) => {
    // 这里可以使用MathJax或KaTeX解析公式
      return formula.replace(/\$\$(.*?)\$\$/g, '<span class="math-formula">$1</span>')
    }
    const handleImageClick = (event: MouseEvent) => {
      if ((event.target as HTMLElement).tagName === 'IMG') {
        // 实现图片放大逻辑
        const imgSrc = (event.target as HTMLImageElement).src
        emit('image-click', imgSrc)
      }
    }
    return {
      selectedValue,
      parseFormula,
      handleImageClick,
      handleChange,
    }
  },
  render() {
    return (
      <ul class="single-choice">
        {this.options.map(option => (
          <li>
            <label key={option.value} class="choice-item">
              <input
                type="radio"
                value={option.value}
                checked={this.selectedValue === option.value}
                disabled={this.disabled}
                onChange={() => this.handleChange(option.value)}
              />
              <span innerHTML={option.label}></span>
            </label>
          </li>
        ))}
      </ul>
    )
  },
})
