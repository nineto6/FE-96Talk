/**
 * 추후 에러 핸들링에 사용할 함수
 *
 * ver2. 로 관리 할 예정
 * @param response
 */
export function responseHandler(response: any) {
  switch (response.data.status) {
    case 200:
      // success
      break;
    case 400:
      // fail
      break;
  }
}
