'use strict';
const db = uniCloud.database();

exports.main = async (event, context) => {
  console.log('收到请求数据：', event);
  
  const { name, contact, content } = event;
  
  // 数据校验
  if (!name || !contact || !content) {
    console.error('缺少必要参数');
    return {
      code: 400,
      message: '缺少必要参数'
    };
  }

  try {
    const res = await db.collection('feedback').add({
      name,
      contact,
      content,
      create_time: Date.now()
    });
    
    console.log('数据插入成功：', res);
    
    return {
      code: 200,
      message: '反馈提交成功',
      data: res
    };
  } catch (err) {
    console.error('数据库操作失败：', err);
    return {
      code: 500,
      message: '服务器内部错误',
      error: err.message
    };
  }
}; 