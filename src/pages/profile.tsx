import { Button, Stack, Text, Input, Heading } from "@chakra-ui/react"
import Router from "next/router"
import { useEffect, useState } from "react"

import { useUser } from "lib/hooks"

export default function ProfilePage() {
  const [user, { loading, mutate }] = useUser()
  const [errorMsg, setErrorMsg] = useState("")

  async function handleDeleteProfile() {
    if (confirm("Biztosan törlöd a profilodat?")) {
      const res = await fetch("/api/user", {
        method: "DELETE",
      })

      if (res.status === 204) {
        mutate({ user: null })
        Router.replace("/")
      }
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const body = {
      password: e.currentTarget.password.value,
      newpassword: e.currentTarget.newpassword.value,
      name: e.currentTarget.username.value,
      email: e.currentTarget.email.value,
    }

    const res = await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const userObj = await res.json()
      Router.replace("/")
      // set user to useSWR state
      mutate(userObj)
    } else {
      setErrorMsg(await res.text())
    }
  }

  useEffect(() => {
    // redirect user to login if not authenticated
    if (!loading && !user) Router.replace("/login")
  }, [user, loading])

  return (
    <>
      <Heading as="h1">Profilom</Heading>
      {user && (
        <>
          {errorMsg && <Text color="tomato">{errorMsg}</Text>}
          <form onSubmit={onSubmit}>
            <Stack spacing={3} shouldWrapChildren>
              <Input
                variant="outline"
                type="text"
                name="username"
                placeholder="Név"
                defaultValue={user.name}
                isRequired
              />
              <Input
                variant="outline"
                type="text"
                name="email"
                value={user.email}
                isRequired
                isReadOnly
              />
              <Input
                variant="outline"
                type="password"
                name="password"
                placeholder="Régi jelszó"
              />
              <Input
                variant="outline"
                type="password"
                name="newpassword"
                placeholder="Új jelszó"
              />
              <Stack direction="row" spacing={2}>
                <Button colorScheme="red" onClick={handleDeleteProfile}>
                  Fiók törlése
                </Button>
                <Button colorScheme="green" type="submit">
                  Mentés
                </Button>
              </Stack>
            </Stack>
          </form>
        </>
      )}
    </>
  )
}
