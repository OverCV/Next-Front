import { z } from 'zod'

import { CampaignCreationSchema } from '@/src/lib/validation'

// Tipo para los valores del formulario
export type CampanaFormValues = z.infer<typeof CampaignCreationSchema>

// Props comunes para componentes del formulario
export interface FormSectionProps {
	className?: string
} 