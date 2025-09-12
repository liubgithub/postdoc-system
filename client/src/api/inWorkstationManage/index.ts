// 在站管理相关API接口

// 获取在站考核数据
export const getInWorkstationAssessments = async (assessmentType: string) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/admin/inWorkstation/assessments?type=${encodeURIComponent(assessmentType)}`, {
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
    console.error('获取在站考核数据失败:', error);
    return { data: null, error };
  }
};

// 获取考核详情
export const getAssessmentDetail = async (assessmentId: number) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/admin/inWorkstation/assessments/${assessmentId}`, {
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
    console.error('获取考核详情失败:', error);
    return { data: null, error };
  }
};

// 审核考核
export const approveAssessment = async (assessmentId: number, approved: boolean, comment?: string) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/admin/inWorkstation/assessments/${assessmentId}/approve`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        approved,
        comment: comment || ''
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error('审核考核失败:', error);
    return { data: null, error };
  }
};

// 获取考核流程状态
export const getAssessmentProcess = async (assessmentId: number) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/admin/inWorkstation/assessments/${assessmentId}/process`, {
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
    console.error('获取考核流程失败:', error);
    return { data: null, error };
  }
};

// 搜索考核数据
export const searchAssessments = async (params: {
  type: string;
  name?: string;
  studentId?: string;
  status?: string;
}) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('type', params.type);
    if (params.name) queryParams.append('name', params.name);
    if (params.studentId) queryParams.append('student_id', params.studentId);
    if (params.status) queryParams.append('status', params.status);
    
    const response = await fetch(`/api/admin/inWorkstation/assessments/search?${queryParams.toString()}`, {
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
    console.error('搜索考核数据失败:', error);
    return { data: null, error };
  }
};

// 导出考核数据
export const exportAssessments = async (assessmentType: string) => {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('没有找到token，请先登录');
      return { data: null, error: new Error('请先登录') };
    }
    
    const response = await fetch(`/api/admin/inWorkstation/assessments/export?type=${encodeURIComponent(assessmentType)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 处理文件下载
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${assessmentType}数据.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    return { data: '导出成功', error: null };
  } catch (error) {
    console.error('导出考核数据失败:', error);
    return { data: null, error };
  }
};
