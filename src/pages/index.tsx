import { Input, Wrap, WrapItem, Text } from "@chakra-ui/react"
import { useState } from "react"
import useSWR from "swr"
import { useDebouncedCallback } from "use-debounce"

import { BookPreview } from "components/books/BookPreview"
import { Loading } from "components/Loading"
import { Main } from "components/Main"
import { fetcher } from "lib/hooks"
import { BookWithCategories } from "lib/interfaces"

const Index = () => {
  const [term, setTerm] = useState("")
  const { data, error } = useSWR<BookWithCategories[]>(`/api/books?q=${term}`, fetcher)
  const debounced = useDebouncedCallback((value) => setTerm(value), 500)

  if (error) return <div>Nem sikerült betölteni a könyveket</div>

  return (
    <Main>
      <Input
        placeholder="Keress a könyvek között!"
        mt="1rem"
        onChange={(e) => debounced.callback(e.target.value)}
      />
      {data ? (
        <>
          {data.length ? (
            <Wrap spacing="2rem" justify="center">
              {data.map((book) => (
                <WrapItem key={book.id}>
                  <BookPreview book={book} />
                </WrapItem>
              ))}
            </Wrap>
          ) : (
            <Text size="lg">Nincs a keresésnek megfelelő találat</Text>
          )}
        </>
      ) : (
        <Loading />
      )}
    </Main>
  )
}

export default Index
