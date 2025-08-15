export async function sendSearch(ObjData: any) {
    const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ObjData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to contact gpt');
  }

  return response.json();
} 