export function useStatusHandler<
  IdType extends string | number,
  StatusType extends string,
  EventName extends string
>(emit: (event: EventName, id: IdType, status: StatusType) => void, eventName: EventName) {
  
  const handleStatusChange = (id: IdType, newStatus: StatusType) => {
    console.log(`useStatusHandler: Emitting ${eventName} for ID: ${id}, New Status: ${newStatus}`)
    emit(eventName, id, newStatus)
  }

  return { handleStatusChange }
}

export function useStatusFormatter<T extends string>(statusMap: Record<T, string>) {
  const formatStatus = (status: T): string => {
    return statusMap[status] || status;
  };

  return { formatStatus };
}