import { h } from 'vue'
import {
  PhList,
  PhUser,
  PhUploadSimple,
  PhHouse,
  PhCaretDown,
  PhImage,
  PhPlay,
  PhPause,
  PhSpeakerHigh,
  PhSpeakerX,
  PhHeart,
  PhDotsThreeVertical,
  PhPlus,
  PhMinus,
  PhTrash,
  PhMagnifyingGlass,
  PhTable,
  PhFlag,
  PhCheck,
  PhPencilSimple,
  PhX,
  PhFunnel
} from '@phosphor-icons/vue'

interface IconProps {
  size?: number
  fill?: boolean
}

export function FilterIcon(props: IconProps = {}) {
  return h(PhFunnel, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function XIcon(props: IconProps = {}) {
  return h(PhX, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function UserIcon(props: IconProps = {}) {
  return h(PhUser, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function UploadIcon(props: IconProps = {}) {
  return h(PhUploadSimple, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function HomeIcon(props: IconProps = {}) {
  return h(PhHouse, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function ChevronDownIcon(props: IconProps = {}) {
  return h(PhCaretDown, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function ImageIcon(props: IconProps = {}) {
  return h(PhImage, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function PlayIcon(props: IconProps = {}) {
  return h(PhPlay, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function PauseIcon(props: IconProps = {}) {
  return h(PhPause, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function Volume2Icon(props: IconProps = {}) {
  return h(PhSpeakerHigh, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function VolumeXIcon(props: IconProps = {}) {
  return h(PhSpeakerX, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function HeartIcon(props: IconProps = {}) {
  return h(PhHeart, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function MoreVerticalIcon(props: IconProps = {}) {
  return h(PhDotsThreeVertical, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function PlusIcon(props: IconProps = {}) {
  return h(PhPlus, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function MinusIcon(props: IconProps = {}) {
  return h(PhMinus, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function TrashIcon(props: IconProps = {}) {
  return h(PhTrash, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function SearchIcon(props: IconProps = {}) {
  return h(PhMagnifyingGlass, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function ListIcon(props: IconProps = {}) {
  return h(PhList, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function GridIcon(props: IconProps = {}) {
  return h(PhTable, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function FlagIcon(props: IconProps = {}) {
  return h(PhFlag, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function CheckIcon(props: IconProps = {}) {
  return h(PhCheck, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}

export function PencilIcon(props: IconProps = {}) {
  return h(PhPencilSimple, { weight: props.fill ? 'fill' : 'bold', size: props.size || 24 })
}
