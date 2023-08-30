import FormPage from '@/components/form/Form'


import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crowda | Create Project',
  description: 'Create a project on Crowda',
}

const CreateProject = () => {
  return (
    <>
      <FormPage />
    </>
  )
}

export default CreateProject