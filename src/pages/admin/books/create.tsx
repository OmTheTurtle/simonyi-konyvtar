import { Heading } from "@chakra-ui/react"
import React from "react"
import { BookForm } from "components/books/BookForm"

const CreateBook = () => {
  return (
    <>
      <Heading as="h2">Új könyv felvétele</Heading>
      <BookForm />
    </>
  )
}

export default CreateBook
