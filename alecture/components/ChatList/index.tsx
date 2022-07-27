import Chat from '@components/Chat';
import { IDM } from '@typings/db';
import React, { forwardRef, RefObject, useCallback, VFC } from 'react';
import Scrollbars from 'react-custom-scrollbars';
import { ChatZone, Section, StickyHeader } from './styles';

interface Props {
  chatSections: { [key: string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>;
  isEmpty: boolean;
  isReachingEnd: boolean;
  scrollRef: RefObject<Scrollbars>;
}

const ChatList: VFC<Props> = ({ chatSections, setSize, isEmpty, isReachingEnd, scrollRef }) => {
  const onScroll = useCallback((values) => {
    if (values.scrollTop === 0 && !isReachingEnd) {
      console.log('가장위');
      setSize((prevSize) => prevSize + 1).then((res) => {
        console.log(scrollRef.current?.getScrollHeight(), values.scrollHeight);
        if (scrollRef?.current) {
          scrollRef.current?.scrollTop(scrollRef.current?.getScrollHeight() - values.scrollHeight);
          // scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
        }
      });
    }
  }, []);

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
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
