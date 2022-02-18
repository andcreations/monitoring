import { Injectable } from '@nestjs/common';
import { PropertyService } from '../../property/service';

/** */
const CHATS_PROPERTY = 'telegram.chats';

/** */
interface TelegramChat {
  /** */
  userName: string;

  /** */
  chatId: number;
}

/** */
@Injectable()
export class TelegramBotUserService {
  /** */
  constructor(
    private readonly propertyService: PropertyService,
  ) {}

  /** */
  async setChatId(userName: string, chatId: number): Promise<void> {
  // get
    const chats = await this.propertyService.get<TelegramChat[]>(
      CHATS_PROPERTY,
      [],
    );

  // update
    const index = chats.findIndex(chat => chat.userName === userName);
    if (index >= 0) {
      chats[index].chatId = chatId;
    }
    else {
      chats.push({ userName, chatId });
    }

  // set
    await this.propertyService.set(CHATS_PROPERTY, chats);
  }

  /** */
  async getAllChatIds(): Promise<number[]> {
    const chats = await this.propertyService.get<TelegramChat[]>(
      CHATS_PROPERTY,
      [],
    );
    return chats.map(chat => chat.chatId);
  }
}