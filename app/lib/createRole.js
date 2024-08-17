
export const  createRole = async (userId, role) =>{
    await fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({userId,role}),
    });
  }

  export const  upgradeRole = async (userId, role) =>{

    await fetch('/api/roles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:JSON.stringify({userId,role}),
    });
  }