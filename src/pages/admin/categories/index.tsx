import {
  Button,
  Flex,
  Input,
  FormControl,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react"
import { Category, CategoryCreateInput } from "@prisma/client"
import { FormEvent, useState } from "react"
import useSWR from "swr"

import { CategoryList } from "components/categories/CategoryList"
import ErrorPage from "components/ErrorPage"
import { Loading } from "components/Loading"
import { fetcher, useRequireRoles } from "lib/hooks"
import { userrole } from "lib/prismaClient"

export default function CategoriesIndexPage() {
  const hasAccess = useRequireRoles([userrole.ADMIN])
  if (!hasAccess) {
    return <ErrorPage statusCode={401} message="Nincs megfelelő jogosultságod!" />
  }
  const [newCategory, setNewCategory] = useState("")
  const { data, error, mutate } = useSWR<Category[]>("/api/categories", fetcher)

  const toast = useToast()

  if (error) return <Text fontSize="lg">Nem sikerült betölteni a kategóriákat</Text>
  if (!data) return <Loading />

  async function handleDelete(cat: Category) {
    if (
      confirm(
        `A kategória törlésével minden kapcsolódó könyvnél is törlődik.\n
        Biztosan törlöd a(z) "${cat.name}" kategóriát?`,
      )
    ) {
      const response = await fetch(`/api/categories/${cat.id}`, {
        method: "DELETE",
      })
      if (response.ok) {
        mutate((categories) => {
          return [...categories.filter((it) => it.id !== cat.id)]
        })
      } else {
        const responseMessage = (await response.json()).message
        toast({
          title: "Sikertelen művelet",
          description: responseMessage,
          status: "error",
          duration: 3000,
          isClosable: true,
        })
      }
    }
  }

  async function handleAddCategory(event: FormEvent) {
    event.preventDefault()
    const category: CategoryCreateInput = { name: newCategory }
    const res = await fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify(category),
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.ok) {
      setNewCategory("")

      mutate(async (categories) => {
        const newCategory = await res.json()

        return [newCategory, ...categories.slice(1)]
      })
    }
  }

  async function handleEditCategory({ id, name }) {
    const newName = prompt("Kategória szerkesztése", name)
    if (newName) {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: newName }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        try {
          const category = await response.json()
          mutate(data.map((it) => (it.id === category.id ? category : it)))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }

  return (
    <>
      <form onSubmit={handleAddCategory}>
        <Flex direction="row" mb={6}>
          <FormControl mr={4} flex="1">
            <Input
              isRequired
              placeholder="Új kategória"
              value={newCategory}
              onChange={(e: FormEvent<HTMLInputElement>) =>
                setNewCategory(e.currentTarget.value)
              }
            />
          </FormControl>
          <Button type="submit">Hozzáadás</Button>
        </Flex>
      </form>
      <Heading as="h1">Kategóriák</Heading>
      {data && (
        <CategoryList
          data={data}
          handleDelete={handleDelete}
          handleEdit={handleEditCategory}
        />
      )}
    </>
  )
}
