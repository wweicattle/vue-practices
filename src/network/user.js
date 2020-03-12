import { request, request1 } from "./request";
export function user(url, user) {
    return request(
        url,
        user
    )
}
export function menu(url,user) {
    return request1(
        url,
        user
    )

}
