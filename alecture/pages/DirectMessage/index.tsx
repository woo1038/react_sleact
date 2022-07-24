import Workspace from '@layouts/Workspace';
import { Container } from '@pages/Channel/styles';
import { Header } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import React, { useCallback, useState } from 'react';
import { useParams } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import { IDM } from '@typings/db';
import axios from 'axios';
import makeSection from '@utils/makeSection';

const DirectMessage = () => {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();
  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const { data: chatData, mutate: mutateChat, revalidate } = useSWR<IDM[]>(
    `/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );
  console.log(111, chatData);
  const [chat, onChangeChat, setChat] = useInput('');

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();

      if (chat?.trim()) {
        axios
          .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
            content: chat,
          })
          .then(() => {
            revalidate();
            setChat('');
          })
          .catch(console.error);
      }
    },
    [chat],
  );

  if (!userData || !myData) return null;

  const chatSections = makeSection(chatData ? [...chatData].reverse() : []);

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList chatSections={chatSections} />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} placeholder="" />
    </Container>
  );
};

export default DirectMessage;
