import { ElMessage } from "element-plus";
// 文件下载函数(除paper外)
export const downloadFile = async (fileType: string, id: number, filename: string) => {
  try {
    // raw.GET 是 openapi-fetch 的客户端，它会自动尝试将响应内容解析为JSON。但是PDF文件是二进制数据，不是JSON格式，所以会抛出 "Unexpected token '%', "%PDF-1.4..." is not valid JSON" 错误。
    // 使用标准的 fetch API 而不是 raw.GET，避免JSON解析问题
    const response = await fetch(`/api/${fileType}/download/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      ElMessage.success('下载成功');
    } else {
      ElMessage.error('下载失败');
    }
  } catch (error) {
    console.error('下载错误:', error);
    ElMessage.error('下载失败');
  }
};

// 文件下载函数(paper)
export const downloadPaper = async ( id: number, field: string, filename: string) => {
  try {
    // raw.GET 是 openapi-fetch 的客户端，它会自动尝试将响应内容解析为JSON。但是PDF文件是二进制数据，不是JSON格式，所以会抛出 "Unexpected token '%', "%PDF-1.4..." is not valid JSON" 错误。
    // 使用标准的 fetch API 而不是 raw.GET，避免JSON解析问题
    const response = await fetch(`/api/pre_entry_paper/download/${id}/${field}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      ElMessage.success('下载成功');
    } else {
      ElMessage.error('下载失败');
    }
  } catch (error) {
    console.error('下载错误:', error);
    ElMessage.error('下载失败');
  }
};