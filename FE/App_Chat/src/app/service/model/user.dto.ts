export class UserDto{
    userName: any;
    id: any;
    status?: number;
    sex?: number;
    avartarPath: any;
    emailAddress: any;
}

export class GroupDto{
    id : any;
    nameGroup:any;
    userName: any;
    avartarPath :any;
    groupType?: string;
    lastMessage: any;
    lastMessageDate: any;
    users :UserDto[]=[];
}
export class LoginUserDto{
    id:any;
    userName: any;
    password: any;
    emailAddress: any;
    avartarPath: any;
}