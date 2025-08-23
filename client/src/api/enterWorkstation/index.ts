// 获取导师的申请列表
export const getTeacherApplications = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('当前token:', token); // 调试信息
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch('/api/entryMange/teacher/students', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    console.log('API响应状态:', response.status); // 调试信息
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('API调用错误:', error); // 调试信息
    return { data: null, error };
  }
};

// 导师获取特定学生详细信息
export const getStudentDetail = async (userId: number, businessType: string = "进站申请") => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/entryMange/teacher/student/${userId}?business_type=${businessType}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// 导师审核申请
export const approveApplication = async (userId: number, approved: boolean, comment?: string, businessType: string = "进站申请") => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/entryMange/teacher/student/${userId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        approved,
        comment: comment || '',
        business_type: businessType
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// 获取用户自己的进站申请
export const getMyEnterWorkstation = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch('/api/enterWorkstation/apply', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// 提交或更新进站申请
export const submitEnterWorkstation = async (data: any) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch('/api/enterWorkstation/apply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// 获取当前用户的process_types
export const getMyProcessTypes = async () => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch('/api/enterWorkstation/my-process-types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// 根据用户ID获取process_types（仅管理员可用）
export const getProcessTypesByUserId = async (userId: number) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/enterWorkstation/process-types/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// 导师获取指定学生的进站考核数据
export const getStudentEnterAssessment = async (studentId: number) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/enterAssessment/assessment/${studentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('获取学生进站考核数据失败:', error);
    return { data: null, error };
  }
};