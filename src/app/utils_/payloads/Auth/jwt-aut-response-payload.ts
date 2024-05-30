export class JwtAutResponsePayload{
    user!: {
        id: any,
        fullname: string,
        username: string,
        class_level: string,
        firsttime: string,
        gender: string,
        subject: any[],
        roles: any[],
    };
}