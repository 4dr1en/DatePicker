import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import DatePicker from '../DatePicker.vue'
import DaySelector from '../datePickerVisual/DaySelector.vue'

describe('DatePicker', () => {
	it('By default the input has no value', () => {
		const wrapper = mount(DatePicker)
		expect(wrapper.find('input').element.value).toBe('')
	})

	it('The input displays the initial date value', () => {
		const wrapper = mount(DatePicker, {
			props: {
				modelValue: new Date('1997-12-18'),
			},
		})
		expect(wrapper.find('input').element.value).toBe('18/12/1997')
	})

	it('The input updates when the modelValue prop changes', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				modelValue: new Date('1997-12-18'),
			},
		})
		expect(wrapper.find('input').element.value).toBe('18/12/1997')

		await wrapper.setProps({ modelValue: new Date('2001-07-25') })
		expect(wrapper.find('input').element.value).toBe('25/07/2001')
	})

	describe('format prop ISO', () => {
		it('displays the initial date value in iso format', () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date('1997-12-18'),
					format: 'YYYY-MM-DD',
				},
			})
			expect(wrapper.find('input').element.value).toBe('1997-12-18')
		})

		it('updates the input when the modelValue prop changes', async () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date('1997-12-18'),
					format: 'YYYY-MM-DD',
				},
			})
			expect(wrapper.find('input').element.value).toBe('1997-12-18')

			await wrapper.setProps({ modelValue: new Date('2001-07-25') })
			expect(wrapper.find('input').element.value).toBe('2001-07-25')
		})
	})

	describe('format prop US format', () => {
		it('displays the initial date value in US format', () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date('1997-12-18'),
					format: 'MM/DD/YYYY',
				},
			})
			expect(wrapper.find('input').element.value).toBe('12/18/1997')
		})

		it('updates the input when the modelValue prop changes', async () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date('1997-12-18'),
					format: 'MM/DD/YYYY',
				},
			})
			expect(wrapper.find('input').element.value).toBe('12/18/1997')

			await wrapper.setProps({ modelValue: new Date('2001-07-25') })
			expect(wrapper.find('input').element.value).toBe('07/25/2001')
		})
	})

	describe('format prop armenian format', () => {
		it('displays the initial date value in Armenian format', () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date('1997-12-18'),
					format: 'DD.MM.YYYY',
				},
			})
			expect(wrapper.find('input').element.value).toBe('18.12.1997')
		})

		it('updates the input when the modelValue prop changes', async () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date('1997-12-18'),
					format: 'DD.MM.YYYY',
				},
			})
			expect(wrapper.find('input').element.value).toBe('18.12.1997')

			await wrapper.setProps({ modelValue: new Date('2001-07-25') })
			expect(wrapper.find('input').element.value).toBe('25.07.2001')
		})
	})

	describe('emits', () => {
		it('emits the updated date when a date is selected', async () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date('2022-01-01'),
				},
			})

			const input = wrapper.find('input')
			await input.setValue('14/02/2022')

			const emitted = wrapper.emitted('update:modelValue')
			expect(emitted).toBeTruthy()
			expect((emitted?.[0]?.[0] as Date)?.toLocaleDateString('en-UK')).toBe('14/02/2022')
		})

		it('emits only one event when the date is selected via the visual picker', async () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date('2022-01-01'),
				},
				attachTo: document.body,
				global: {
					stubs: {
						Transition: false,
					},
				},
			})

			const visualPickerButton = wrapper.find('button.date-picker-open-button')
			await visualPickerButton.trigger('click')

			const dayButtons = wrapper.findComponent(DaySelector).findAll('button.day-card')
			const dayButton = dayButtons.find(btn => btn.text().trim() === '15')!
			expect(dayButton).toBeTruthy()
			dayButton.trigger('click')

			expect(wrapper.emitted('update:modelValue')?.length).toBe(1)
			expect((wrapper.emitted('update:modelValue')?.[0]?.[0] as Date)?.toLocaleDateString('en-UK')).toBe('15/01/2022')

			wrapper.unmount()
		})

		it('does not emit update:modelValue when the props modelValue is updated', async () => {
			const wrapper = mount(DatePicker, {
				props: {
					modelValue: new Date(2022, 0, 1),
				},
			})

			await wrapper.setProps({ modelValue: new Date(2029, 0, 1) })

			expect(wrapper.emitted('update:modelValue')).toBeUndefined()
		})
	})
})