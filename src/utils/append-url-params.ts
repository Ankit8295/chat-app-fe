const appendUrlParams = (
  payload: Record<string, string | string[]>,
): URLSearchParams => {
  const params = new URLSearchParams();

  Object.entries(payload).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((element) => {
          params.append(key, element);
        });
      } else {
        params.append(key, value);
      }
    }
  });

  return params;
};

export default appendUrlParams;
