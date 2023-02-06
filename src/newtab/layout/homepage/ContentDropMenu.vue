<script lang="ts" setup>
interface PropsType {
  x: Number
  y: Number
  showDropdownRef: Boolean
  options: { label: string; key: string }[]
}
defineProps<PropsType>()
const emit = defineEmits(['update:showDropdownRef', 'd'])
const onClickoutside = () => {
  emit('update:showDropdownRef', false)
}
const handleSelect = (e: any) => {
  emit('d', e)
}
</script>

<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="options"
    :show="showDropdownRef"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  />
</template>
