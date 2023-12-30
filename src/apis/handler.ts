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
