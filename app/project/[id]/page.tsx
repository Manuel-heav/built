import React from 'react'


interface ProjectDetailPageProps {
    params: {
      id: string;
    };
  }
const SingleProject = ({ params }: ProjectDetailPageProps) => {
    const { id } = params;
  return (
    <div>Project ID: {id}</div>
  )
}

export default SingleProject