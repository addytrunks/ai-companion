"use client"

import { Category, Companion } from "@prisma/client"

interface CompanionFormProps{
    categories:Category[],
    initialData:Companion | null
}

const CompanionForm = ({initialData,categories}:CompanionFormProps) => {
  return (
    <div>CompanionForm</div>
  )
}

export default CompanionForm