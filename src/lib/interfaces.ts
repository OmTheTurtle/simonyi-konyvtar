import { Book, Category, Order, Comment, BookToOrder, User } from "@prisma/client"

export interface BookWithCategories extends Book {
  categories: Category[]
}

export interface BookWithCategoryIds extends Book {
  categories: { id: number }[]
}

export interface BookWithCategoriesAndOrders extends BookWithCategories {
  orders: (BookToOrder & { orders: Order })[]
}

export interface OrderWithComments extends Order {
  comments: Comment[]
}

interface BookToOrderWithBooks extends BookToOrder {
  books: Book
}

export interface OrderWithBooks extends Order {
  books: BookToOrderWithBooks[]
}

export interface OrderWithBooksAndUser extends OrderWithBooks {
  user: Partial<User>
}

export interface OrderWithBooksAndComments extends OrderWithBooks {
  comments: CommentWithUser[]
}

export interface CommentWithUser extends Comment {
  user: User
}

export interface Cart {
  sumCount: number
  books: CartItem[]
}

export interface CartItem {
  id: number
  quantity: number
  title: string
  author: string
}
