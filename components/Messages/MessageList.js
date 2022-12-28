import MessageListItem from './MessageListItem';
import {useSession} from 'next-auth/react'

export default function MessageList({ children }) {
  return <ul className="flex flex-col">{children}</ul>;
}
