import FormPage from '@/components/form/Form';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Malaika | Create Project',
  description: 'Create a project on Malaika',
};

const CreateProject = () => {
  return (
    <>
      <FormPage />
    </>
  );
};

export default CreateProject;
