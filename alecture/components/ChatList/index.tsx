import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { useCallback, useRef, VFC } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from './styles';

interface Props {
  chatSections: { [key: string]: IDM[] };
}

const ChatList: VFC<Props> = ({ chatSections }) => {
  const scrollbarRef = useRef(null);
  const onScroll = useCallback((values) => {
    if (values.scrollTop === 0) {
      console.log('가장위');
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections)?.map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat}></Chat>
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
};

export default ChatList;
