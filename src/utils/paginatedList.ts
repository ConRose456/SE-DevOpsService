type PagnationArgs = {
  first: number;
  after?: string | undefined;
};

export const paginateResponse = (list: any[], args: PagnationArgs) => {
  const first = args.first < 250 ? args.first : 250;
  const cursorIndex = list.findIndex((item) => item.id == args.after);

  const paginatedList = args.after
    ? cursorIndex != -1
      ? list.slice(cursorIndex + 1)
      : list
    : list;

  const response = paginatedList.slice(0, first);

  return {
    total: list.length,
    hasNext: paginatedList.length > first,
    edges: response.map((item) => ({
        cursor: item.id,
        node: item,
    })),
  };
};
