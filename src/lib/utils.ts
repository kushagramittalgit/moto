import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: string) {
  return amount.replace(/~/g, '').trim()
}

export function getProviderColor(provider: string) {
  switch (provider.toLowerCase()) {
    case 'aws':
      return 'bg-orange-500'
    case 'gcp':
    case 'google':
      return 'bg-blue-500'
    case 'azure':
      return 'bg-cyan-500'
    default:
      return 'bg-gray-500'
  }
}

export function getModalityIcon(modality: string) {
  switch (modality) {
    case 'text':
      return 'MessageSquare'
    case 'vision':
      return 'Eye'
    case 'audio':
      return 'Volume2'
    case 'video':
      return 'Video'
    case 'multimodal':
      return 'Layers'
    default:
      return 'Brain'
  }
}