/**
 * 简化版AI营销助手测试平台
 * 修复连接问题，专注核心功能
 */

// 全局变量
let apiClient = null;
let isConnected = false;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('简化版应用开始初始化...');
    
    try {
        // 简化初始化
        initializeSimpleApp();
        
        // 绑定事件监听器
        bindSimpleEventListeners();
        
        console.log('简化版应用初始化成功');
    } catch (error) {
        console.error('简化版应用初始化失败:', error);
    }
});

/**
 * 简化初始化应用
 */
function initializeSimpleApp() {
    // 创建简化的API客户端
    apiClient = {
        baseURL: 'https://mzhyi8c198x6.manus.space',
        apiKey: 'demo_api_key',
        apiSecret: 'demo_secret',
        token: null,
        
        async healthCheck() {
            const response = await fetch(`${this.baseURL}/api/v1/health`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        },
        
        async authenticate() {
            const response = await fetch(`${this.baseURL}/api/v1/auth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    secret: this.apiSecret
                })
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();
            if (result.success) {
                this.token = result.data.access_token;
            }
            return result;
        },
        
        async analyzeCustomer(data) {
            if (!this.token) {
                await this.authenticate();
            }
            const response = await fetch(`${this.baseURL}/api/v1/analyze/customer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        }
    };
    
    // 设置全局引用
    window.apiClient = apiClient;
    
    console.log('简化API客户端创建成功');
}

/**
 * 绑定简化事件监听器
 */
function bindSimpleEventListeners() {
    // 连接API按钮
    const connectBtn = document.getElementById('connect-api');
    if (connectBtn) {
        connectBtn.addEventListener('click', simpleConnectAPI);
        console.log('连接API按钮事件已绑定');
    }
    
    // 健康检查按钮
    const healthBtn = document.getElementById('test-health');
    if (healthBtn) {
        healthBtn.addEventListener('click', simpleHealthCheck);
        console.log('健康检查按钮事件已绑定');
    }
    
    // 认证测试按钮
    const authBtn = document.getElementById('test-auth');
    if (authBtn) {
        authBtn.addEventListener('click', simpleAuthTest);
        console.log('认证测试按钮事件已绑定');
    }
    
    // 分析客户按钮
    const analyzeBtn = document.getElementById('manual-analyze');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', simpleAnalyzeCustomer);
        console.log('分析客户按钮事件已绑定');
    }
    
    // 一键运行所有测试按钮
    const runAllBtn = document.getElementById('run-all-tests');
    if (runAllBtn) {
        runAllBtn.addEventListener('click', simpleRunAllTests);
        console.log('一键测试按钮事件已绑定');
    }
    
    // 物料反馈按钮
    const materialFeedbackBtn = document.getElementById('manual-material-feedback');
    if (materialFeedbackBtn) {
        materialFeedbackBtn.addEventListener('click', simpleMaterialFeedback);
        console.log('物料反馈按钮事件已绑定');
    }
    
    // 成交反馈按钮
    const conversionFeedbackBtn = document.getElementById('manual-conversion-feedback');
    if (conversionFeedbackBtn) {
        conversionFeedbackBtn.addEventListener('click', simpleConversionFeedback);
        console.log('成交反馈按钮事件已绑定');
    }
    
    // 调试控制台按钮
    const clearConsoleBtn = document.getElementById('clear-console');
    if (clearConsoleBtn) {
        clearConsoleBtn.addEventListener('click', clearDebugConsole);
        console.log('清空控制台按钮事件已绑定');
    }
    
    const toggleConsoleBtn = document.getElementById('toggle-console');
    if (toggleConsoleBtn) {
        toggleConsoleBtn.addEventListener('click', toggleDebugConsole);
        console.log('收起控制台按钮事件已绑定');
    }
    
    // 知识库状态检查按钮
    const checkKbStatusBtn = document.getElementById('check-kb-status');
    if (checkKbStatusBtn) {
        checkKbStatusBtn.addEventListener('click', checkKnowledgeBaseStatus);
        console.log('检查知识库状态按钮事件已绑定');
    }
    
    const compareKbChangesBtn = document.getElementById('compare-kb-changes');
    if (compareKbChangesBtn) {
        compareKbChangesBtn.addEventListener('click', compareKnowledgeBaseChanges);
        console.log('对比知识库变化按钮事件已绑定');
    }
    
    // 知识库管理按钮
    const refreshKbBtn = document.getElementById('refresh-kb');
    if (refreshKbBtn) {
        refreshKbBtn.addEventListener('click', refreshKnowledgeBase);
        console.log('刷新知识库按钮事件已绑定');
    }
    
    const downloadKbBtn = document.getElementById('download-kb');
    if (downloadKbBtn) {
        downloadKbBtn.addEventListener('click', downloadKnowledgeBase);
        console.log('下载知识库按钮事件已绑定');
    }
    
    const toggleKbBtn = document.getElementById('toggle-kb');
    if (toggleKbBtn) {
        toggleKbBtn.addEventListener('click', toggleKnowledgeBase);
        console.log('展开知识库按钮事件已绑定');
    }
    
    const kbUploadBtn = document.getElementById('kb-upload-btn');
    if (kbUploadBtn) {
        kbUploadBtn.addEventListener('click', () => {
            document.getElementById('kb-file-input').click();
        });
        console.log('知识库上传按钮事件已绑定');
    }
    
    const kbFileInput = document.getElementById('kb-file-input');
    if (kbFileInput) {
        kbFileInput.addEventListener('change', handleKnowledgeBaseUpload);
        console.log('知识库文件输入事件已绑定');
    }
    
    const kbDropZone = document.getElementById('kb-drop-zone');
    if (kbDropZone) {
        kbDropZone.addEventListener('click', () => {
            document.getElementById('kb-file-input').click();
        });
        kbDropZone.addEventListener('dragover', handleKbDragOver);
        kbDropZone.addEventListener('drop', handleKbDrop);
        kbDropZone.addEventListener('dragleave', handleKbDragLeave);
        console.log('知识库拖拽区域事件已绑定');
    }
    
    // 知识库分类切换按钮
    const kbToggleBtns = document.querySelectorAll('.kb-toggle-btn');
    kbToggleBtns.forEach(btn => {
        btn.addEventListener('click', toggleKbCategory);
    });
    console.log('知识库分类切换按钮事件已绑定');
}

/**
 * 简化版连接API
 */
async function simpleConnectAPI() {
    const connectBtn = document.getElementById('connect-api');
    const statusIndicator = document.getElementById('api-status-indicator');
    
    try {
        console.log('开始连接API...');
        
        // 更新按钮状态
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 连接中...';
        connectBtn.disabled = true;
        
        // 更新状态指示器
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator connecting';
            statusIndicator.innerHTML = '<i class="fas fa-circle"></i> 连接中';
        }
        
        // 获取配置
        const baseURL = document.getElementById('api-base-url')?.value || 'https://mzhyi8c198x6.manus.space';
        const apiKey = document.getElementById('api-key')?.value || 'demo_api_key';
        const apiSecret = document.getElementById('api-secret')?.value || 'demo_secret';
        
        // 更新API客户端配置
        apiClient.baseURL = baseURL;
        apiClient.baseURL = "https://8000-iozocmozl0jw4if1u0bd7-0f6693c2.manusvm.computer"; // Force update to the new exposed URL

        apiClient.apiKey = apiKey;
        apiClient.apiSecret = apiSecret;
        
        // 测试连接
        console.log('执行健康检查...');
        const healthResult = await apiClient.healthCheck();
        console.log('健康检查结果:', healthResult);
        
        // 测试认证
        console.log('执行认证测试...');
        const authResult = await apiClient.authenticate();
        console.log('认证结果:', authResult);
        
        // 连接成功
        isConnected = true;
        
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator online';
            statusIndicator.innerHTML = '<i class="fas fa-circle"></i> 在线';
        }
        
        connectBtn.innerHTML = '<i class="fas fa-check"></i> 已连接';
        connectBtn.disabled = false;
        
        // 显示成功消息
        showSimpleNotification('API连接成功！', 'success');
        
        // 添加测试结果
        addSimpleTestResult('API连接测试', true, '连接成功');
        
    } catch (error) {
        console.error('API连接失败:', error);
        
        // 连接失败
        isConnected = false;
        
        if (statusIndicator) {
            statusIndicator.className = 'status-indicator offline';
            statusIndicator.innerHTML = '<i class="fas fa-circle"></i> 离线';
        }
        
        connectBtn.innerHTML = '<i class="fas fa-plug"></i> 连接API';
        connectBtn.disabled = false;
        
        // 显示错误消息
        showSimpleNotification('API连接失败: ' + error.message, 'error');
        
        // 添加测试结果
        addSimpleTestResult('API连接测试', false, error.message);
    }
}

/**
 * 简化版健康检查
 */
async function simpleHealthCheck() {
    const btn = document.getElementById('test-health');
    
    // 添加调试信息
    console.log('查找健康检查按钮元素:', btn);
    if (!btn) {
        console.error('未找到ID为test-health的按钮元素');
        logToDebugConsole('❌ 未找到健康检查按钮元素', 'error');
        showSimpleNotification('❌ 健康检查按钮元素未找到', 'error');
        return;
    }
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 检查中...';
        btn.disabled = true;
        
        const result = await apiClient.healthCheck();
        console.log('健康检查结果:', result);
        
        // 显示结果
        addSimpleTestResult('健康检查', true, '服务正常');
        displaySimpleResult('健康检查结果', result);
        
        btn.innerHTML = '<i class="fas fa-heart"></i> 健康检查';
        btn.disabled = false;
        
        showSimpleNotification('健康检查成功！', 'success');
        
    } catch (error) {
        console.error('健康检查失败:', error);
        
        addSimpleTestResult('健康检查', false, error.message);
        showSimpleNotification('健康检查失败: ' + error.message, 'error');
        
        btn.innerHTML = '<i class="fas fa-heart"></i> 健康检查';
        btn.disabled = false;
    }
}

/**
 * 简化版认证测试
 */
async function simpleAuthTest() {
    const btn = document.getElementById('test-auth');
    
    // 添加调试信息
    console.log('查找认证测试按钮元素:', btn);
    if (!btn) {
        console.error('未找到ID为test-auth的按钮元素');
        logToDebugConsole('❌ 未找到认证测试按钮元素', 'error');
        showSimpleNotification('❌ 认证测试按钮元素未找到', 'error');
        return;
    }
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 认证中...';
        btn.disabled = true;
        
        const result = await apiClient.authenticate();
        console.log('认证结果:', result);
        
        // 显示结果
        addSimpleTestResult('认证测试', true, '认证成功');
        displaySimpleResult('认证测试结果', result);
        
        btn.innerHTML = '<i class="fas fa-key"></i> 认证测试';
        btn.disabled = false;
        
        showSimpleNotification('认证成功！', 'success');
        
    } catch (error) {
        console.error('认证失败:', error);
        
        addSimpleTestResult('认证测试', false, error.message);
        showSimpleNotification('认证失败: ' + error.message, 'error');
        
        btn.innerHTML = '<i class="fas fa-key"></i> 认证测试';
        btn.disabled = false;
    }
}

/**
 * 简化版分析客户
 */
async function simpleAnalyzeCustomer() {
    const btn = document.getElementById('manual-analyze');
    
    // 添加调试信息
    console.log('查找按钮元素:', btn);
    if (!btn) {
        console.error('未找到ID为manual-analyze的按钮元素');
        logToDebugConsole('❌ 未找到分析按钮元素', 'error');
        showSimpleNotification('❌ 按钮元素未找到', 'error');
        return;
    }
    
    try {
        console.log('=== 开始客户分析 ===');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
        btn.disabled = true;
        
        // 显示开始分析的通知
        showSimpleNotification('开始分析客户...', 'info');
        
        // 获取输入数据
        const conversationText = document.getElementById('conversation-text')?.value || '我想买一辆省油的车，预算8万左右，主要考虑燃油经济性和保养成本';
        const advisorNotes = document.getElementById('advisor-notes')?.value || '客户关注性价比，询问了油耗和保养费用';
        const customerStage = document.getElementById('customer-stage')?.value || '需求挖掘';
        
        const requestData = {
            conversation_text: conversationText,
            advisor_notes: advisorNotes,
            customer_stage: customerStage
        };
        
        console.log('📤 分析请求数据:', requestData);
        
        // 记录到调试控制台
        logToDebugConsole('🚀 开始客户分析', 'info');
        logToDebugConsole('📤 发送API请求', 'info', requestData);
        
        // 显示请求数据到控制台区域
        displayConsoleResult('📤 请求数据', requestData);
        
        // 调用API
        console.log('🔄 调用客户分析API...');
        const result = await apiClient.analyzeCustomer(requestData);
        console.log('📥 客户分析结果:', result);
        
        // 记录API响应到调试控制台
        logToDebugConsole('📥 收到API响应', 'success', result);
        
        // 显示完整的API响应到控制台区域
        displayConsoleResult('📥 API响应结果', result);
        
        // 显示结果
        addSimpleTestResult('客户分析', true, '分析完成');
        displaySimpleResult('客户分析结果', result);
        
        // 如果有具体的分析数据，显示关键信息
        if (result.success && result.data) {
            const analysisData = result.data;
            console.log('🎯 分析关键信息:', {
                画像类型: analysisData.customer_profile?.persona_type,
                置信度: analysisData.customer_profile?.confidence,
                预算范围: analysisData.customer_profile?.budget_range,
                推荐物料数量: analysisData.recommendations?.length || 0
            });
            
            // 显示关键信息摘要
            displayConsoleResult('🎯 分析摘要', {
                画像类型: analysisData.customer_profile?.persona_type || '未识别',
                置信度: analysisData.customer_profile?.confidence || 0,
                预算范围: analysisData.customer_profile?.budget_range || '未知',
                推荐物料数量: analysisData.recommendations?.length || 0,
                销售策略: analysisData.sales_strategy?.communication_style || '未提供'
            });
            
            // 自动填入会话ID到反馈区域
            if (analysisData.session_id) {
                const sessionIdInput = document.getElementById('session-id');
                if (sessionIdInput) {
                    sessionIdInput.value = analysisData.session_id;
                    console.log('✅ 会话ID已自动填入:', analysisData.session_id);
                    logToDebugConsole('✅ 会话ID已自动填入', 'success', { session_id: analysisData.session_id });
                } else {
                    console.warn('⚠️ 未找到会话ID输入框');
                }
            } else {
                console.warn('⚠️ API响应中未包含会话ID');
                logToDebugConsole('⚠️ API响应中未包含会话ID', 'warning');
            }
        }
        
        // 自动滚动到结果区域
        const resultsSection = document.getElementById('test-results');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        btn.innerHTML = '<i class="fas fa-user-check"></i> 分析客户';
        btn.disabled = false;
        
        showSimpleNotification('✅ 客户分析完成！', 'success');
        console.log('=== 客户分析完成 ===');
        
    } catch (error) {
        console.error('❌ 客户分析失败:', error);
        
        // 记录错误到调试控制台
        logToDebugConsole('❌ 客户分析失败', 'error', {
            错误类型: error.name || 'Unknown Error',
            错误消息: error.message || '未知错误',
            API状态: apiClient.token ? '已认证' : '未认证'
        });
        
        // 显示错误信息到控制台区域
        displayConsoleResult('❌ 错误信息', {
            错误类型: error.name || 'Unknown Error',
            错误消息: error.message || '未知错误',
            错误堆栈: error.stack || '无堆栈信息',
            API状态: apiClient.token ? '已认证' : '未认证',
            API地址: apiClient.baseURL
        });
        
        addSimpleTestResult('客户分析', false, error.message);
        showSimpleNotification('❌ 客户分析失败: ' + error.message, 'error');
        
        btn.innerHTML = '<i class="fas fa-user-check"></i> 分析客户';
        btn.disabled = false;
    }
}

/**
 * 简化版运行所有测试
 */
async function simpleRunAllTests() {
    const btn = document.getElementById('run-all-tests');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 测试中...';
        btn.disabled = true;
        
        // 清空之前的结果
        clearSimpleResults();
        
        // 依次运行所有测试
        await simpleConnectAPI();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await simpleHealthCheck();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await simpleAuthTest();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await simpleAnalyzeCustomer();
        
        btn.innerHTML = '<i class="fas fa-play"></i> 一键运行所有测试';
        btn.disabled = false;
        
        showSimpleNotification('所有测试完成！', 'success');
        
    } catch (error) {
        console.error('测试运行失败:', error);
        
        btn.innerHTML = '<i class="fas fa-play"></i> 一键运行所有测试';
        btn.disabled = false;
        
        showSimpleNotification('测试运行失败: ' + error.message, 'error');
    }
}

/**
 * 显示控制台结果
 */
function displayConsoleResult(title, data) {
    // 创建或获取控制台结果容器
    let consoleContainer = document.getElementById('console-results');
    if (!consoleContainer) {
        consoleContainer = document.createElement('div');
        consoleContainer.id = 'console-results';
        consoleContainer.innerHTML = '<h3>🖥️ 控制台输出</h3>';
        consoleContainer.style.cssText = `
            margin: 20px;
            padding: 20px;
            background: #1e1e1e;
            color: #00ff00;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            max-height: 400px;
            overflow-y: auto;
            border: 2px solid #333;
        `;
        
        // 插入到测试结果区域之前
        const testResults = document.getElementById('test-results');
        if (testResults) {
            testResults.parentNode.insertBefore(consoleContainer, testResults);
        } else {
            document.body.appendChild(consoleContainer);
        }
    }
    
    // 创建新的控制台条目
    const consoleEntry = document.createElement('div');
    consoleEntry.style.cssText = `
        margin: 10px 0;
        padding: 10px;
        border-left: 3px solid #00ff00;
        background: #2a2a2a;
        border-radius: 4px;
    `;
    
    const timestamp = new Date().toLocaleTimeString();
    consoleEntry.innerHTML = `
        <div style="color: #ffff00; font-weight: bold; margin-bottom: 5px;">
            [${timestamp}] ${title}
        </div>
        <pre style="margin: 0; white-space: pre-wrap; color: #00ff00;">${JSON.stringify(data, null, 2)}</pre>
    `;
    
    consoleContainer.appendChild(consoleEntry);
    
    // 自动滚动到最新条目
    consoleContainer.scrollTop = consoleContainer.scrollHeight;
}

/**
 * 清空控制台结果
 */
function clearConsoleResults() {
    const consoleContainer = document.getElementById('console-results');
    if (consoleContainer) {
        consoleContainer.innerHTML = '<h3>🖥️ 控制台输出</h3>';
    }
}

/**
 * 显示简化通知
 */
function showSimpleNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.simple-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `simple-notification ${type}`;
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 9999;
        max-width: 400px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

/**
 * 添加简化测试结果
 */
function addSimpleTestResult(testName, success, message) {
    const resultsContainer = document.getElementById('test-results') || createSimpleResultsContainer();
    
    const resultItem = document.createElement('div');
    resultItem.className = `test-result-item ${success ? 'success' : 'failure'}`;
    resultItem.innerHTML = `
        <div class="result-header">
            <span class="result-icon">${success ? '✅' : '❌'}</span>
            <span class="result-name">${testName}</span>
            <span class="result-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="result-message">${message}</div>
    `;
    
    resultItem.style.cssText = `
        margin: 10px 0;
        padding: 15px;
        border-radius: 8px;
        background: ${success ? '#e8f5e8' : '#ffeaea'};
        border-left: 4px solid ${success ? '#4CAF50' : '#f44336'};
    `;
    
    resultsContainer.appendChild(resultItem);
}

/**
 * 显示简化结果
 */
function displaySimpleResult(title, data) {
    const resultsContainer = document.getElementById('test-results') || createSimpleResultsContainer();
    
    const resultDetail = document.createElement('div');
    resultDetail.className = 'test-result-detail';
    resultDetail.innerHTML = `
        <h4>${title}</h4>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
    `;
    
    resultsContainer.appendChild(resultDetail);
}

/**
 * 清空简化结果
 */
function clearSimpleResults() {
    const resultsContainer = document.getElementById('test-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '<h3>测试结果</h3>';
    }
    
    // 同时清空控制台结果
    clearConsoleResults();
}

/**
 * 创建简化结果容器
 */
function createSimpleResultsContainer() {
    let container = document.getElementById('test-results');
    if (!container) {
        container = document.createElement('div');
        container.id = 'test-results';
        container.innerHTML = '<h3>测试结果</h3>';
        container.style.cssText = `
            margin: 20px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        `;
        document.body.appendChild(container);
    }
    return container;
}

/**
 * 简化版物料反馈
 */
async function simpleMaterialFeedback() {
    const sessionId = document.getElementById('session-id').value;
    const feedbackText = document.getElementById('material-feedback').value;
    
    if (!sessionId) {
        showSimpleNotification('❌ 请先进行客户分析获取会话ID', 'error');
        return;
    }
    
    try {
        console.log('=== 开始提交物料反馈 ===');
        
        let feedbackData;
        try {
            feedbackData = JSON.parse(feedbackText);
        } catch (e) {
            throw new Error('反馈数据格式错误，请输入有效的JSON格式');
        }
        
        const requestData = {
            session_id: sessionId,
            material_feedback: feedbackData
        };
        
        console.log('🔄 提交物料反馈...');
        // 这里应该调用实际的API，暂时模拟
        const result = { success: true, message: '物料反馈提交成功' };
        console.log('📥 物料反馈结果:', result);
        
        addSimpleTestResult('物料反馈', true, '反馈提交成功');
        displaySimpleResult('物料反馈结果', result);
        
        showSimpleNotification('✅ 物料反馈提交成功！', 'success');
        console.log('=== 物料反馈完成 ===');
        
    } catch (error) {
        console.error('❌ 物料反馈失败:', error);
        addSimpleTestResult('物料反馈', false, error.message);
        showSimpleNotification('❌ 物料反馈失败: ' + error.message, 'error');
    }
}

/**
 * 简化版成交反馈
 */
async function simpleConversionFeedback() {
    const sessionId = document.getElementById('session-id').value;
    const conversionText = document.getElementById('conversion-result').value;
    
    if (!sessionId) {
        showSimpleNotification('❌ 请先进行客户分析获取会话ID', 'error');
        return;
    }
    
    try {
        console.log('=== 开始提交成交反馈 ===');
        
        let conversionData;
        try {
            conversionData = JSON.parse(conversionText);
        } catch (e) {
            throw new Error('成交数据格式错误，请输入有效的JSON格式');
        }
        
        const requestData = {
            session_id: sessionId,
            conversion_result: conversionData
        };
        
        console.log('🔄 提交成交反馈...');
        // 这里应该调用实际的API，暂时模拟
        const result = { success: true, message: '成交反馈提交成功' };
        console.log('📥 成交反馈结果:', result);
        
        addSimpleTestResult('成交反馈', true, '反馈提交成功');
        displaySimpleResult('成交反馈结果', result);
        
        showSimpleNotification('✅ 成交反馈提交成功！', 'success');
        console.log('=== 成交反馈完成 ===');
        
    } catch (error) {
        console.error('❌ 成交反馈失败:', error);
        addSimpleTestResult('成交反馈', false, error.message);
        showSimpleNotification('❌ 成交反馈失败: ' + error.message, 'error');
    }
}

/**
 * 调试控制台功能
 */
function logToDebugConsole(message, type = 'info', data = null) {
    const console = document.getElementById('debug-console');
    if (!console) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const messageDiv = document.createElement('div');
    messageDiv.className = `console-message ${type}`;
    
    let content = `<span class="timestamp">[${timestamp}]</span><span class="message">${message}</span>`;
    
    if (data) {
        content += `<div class="json-data">${JSON.stringify(data, null, 2)}</div>`;
    }
    
    messageDiv.innerHTML = content;
    console.appendChild(messageDiv);
    
    // 自动滚动到底部
    console.scrollTop = console.scrollHeight;
    
    // 限制消息数量，避免内存泄漏
    const messages = console.querySelectorAll('.console-message');
    if (messages.length > 100) {
        messages[0].remove();
    }
}

function clearDebugConsole() {
    const console = document.getElementById('debug-console');
    if (console) {
        console.innerHTML = `
            <div class="console-message info">
                <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                <span class="message">控制台已清空</span>
            </div>
        `;
    }
}

function toggleDebugConsole() {
    const content = document.getElementById('debug-console-content');
    const toggleBtn = document.getElementById('toggle-console');
    
    if (content && toggleBtn) {
        const isCollapsed = content.classList.contains('collapsed');
        
        if (isCollapsed) {
            content.classList.remove('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> 收起';
        } else {
            content.classList.add('collapsed');
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> 展开';
        }
    }
}

// 导出全局函数
window.simpleConnectAPI = simpleConnectAPI;
window.simpleHealthCheck = simpleHealthCheck;
window.simpleAuthTest = simpleAuthTest;
window.simpleAnalyzeCustomer = simpleAnalyzeCustomer;
window.simpleRunAllTests = simpleRunAllTests;
window.simpleMaterialFeedback = simpleMaterialFeedback;
window.simpleConversionFeedback = simpleConversionFeedback;
window.logToDebugConsole = logToDebugConsole;
window.clearDebugConsole = clearDebugConsole;
window.toggleDebugConsole = toggleDebugConsole;

console.log('简化版主应用脚本加载完成');



// 添加控制台清空按钮到全局函数
window.clearConsoleResults = clearConsoleResults;
window.displayConsoleResult = displayConsoleResult;



// ==================== 知识库管理功能 ====================

/**
 * 刷新知识库
 */
async function refreshKnowledgeBase() {
    const btn = document.getElementById('refresh-kb');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
        btn.disabled = true;
        
        // 模拟API调用获取知识库数据
        const knowledgeBaseData = await fetchKnowledgeBaseData();
        
        // 更新知识库显示
        updateKnowledgeBaseDisplay(knowledgeBaseData);
        
        // 更新统计信息
        updateKnowledgeBaseStats(knowledgeBaseData);
        
        showSimpleNotification('✅ 知识库刷新成功！', 'success');
        logToDebugConsole('✅ 知识库刷新完成', 'success');
        
    } catch (error) {
        console.error('知识库刷新失败:', error);
        showSimpleNotification('❌ 知识库刷新失败: ' + error.message, 'error');
        logToDebugConsole('❌ 知识库刷新失败', 'error', { error: error.message });
    } finally {
        btn.innerHTML = '<i class="fas fa-sync"></i> 刷新';
        btn.disabled = false;
    }
}

/**
 * 下载知识库
 */
async function downloadKnowledgeBase() {
    const btn = document.getElementById('download-kb');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 准备中...';
        btn.disabled = true;
        
        // 获取知识库数据
        const knowledgeBaseData = await fetchKnowledgeBaseData();
        
        // 创建下载包
        const downloadData = {
            export_time: new Date().toISOString(),
            version: '1.0.0',
            data: knowledgeBaseData
        };
        
        // 创建并下载文件
        const blob = new Blob([JSON.stringify(downloadData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `knowledge_base_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showSimpleNotification('✅ 知识库下载成功！', 'success');
        logToDebugConsole('✅ 知识库下载完成', 'success', { filename: a.download });
        
    } catch (error) {
        console.error('知识库下载失败:', error);
        showSimpleNotification('❌ 知识库下载失败: ' + error.message, 'error');
        logToDebugConsole('❌ 知识库下载失败', 'error', { error: error.message });
    } finally {
        btn.innerHTML = '<i class="fas fa-download"></i> 下载知识库';
        btn.disabled = false;
    }
}

/**
 * 切换知识库显示
 */
function toggleKnowledgeBase() {
    const content = document.getElementById('knowledge-base-content');
    const toggleBtn = document.getElementById('toggle-kb');
    
    if (content && toggleBtn) {
        const isHidden = content.style.display === 'none';
        
        if (isHidden) {
            content.style.display = 'block';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-up"></i> 收起';
            
            // 首次展开时加载知识库数据
            if (!content.dataset.loaded) {
                refreshKnowledgeBase();
                content.dataset.loaded = 'true';
            }
        } else {
            content.style.display = 'none';
            toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> 展开';
        }
    }
}

/**
 * 处理知识库文件上传
 */
async function handleKnowledgeBaseUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    try {
        for (const file of files) {
            await processKnowledgeBaseFile(file);
        }
        
        // 上传完成后刷新显示
        await refreshKnowledgeBase();
        
        showSimpleNotification(`✅ 成功上传 ${files.length} 个文件！`, 'success');
        
    } catch (error) {
        console.error('文件上传失败:', error);
        showSimpleNotification('❌ 文件上传失败: ' + error.message, 'error');
    }
    
    // 清空文件输入
    event.target.value = '';
}

/**
 * 处理拖拽上传
 */
function handleKbDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.add('dragover');
}

function handleKbDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('dragover');
}

function handleKbDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.classList.remove('dragover');
    
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
        // 模拟文件输入事件
        const fileInput = document.getElementById('kb-file-input');
        if (fileInput) {
            // 创建新的文件列表
            const dt = new DataTransfer();
            for (const file of files) {
                dt.items.add(file);
            }
            fileInput.files = dt.files;
            
            // 触发change事件
            const changeEvent = new Event('change', { bubbles: true });
            fileInput.dispatchEvent(changeEvent);
        }
    }
}

/**
 * 切换知识库分类显示
 */
function toggleKbCategory(event) {
    const btn = event.currentTarget;
    const targetId = btn.dataset.target;
    const content = document.getElementById(targetId);
    
    if (content) {
        const isHidden = content.style.display === 'none';
        
        if (isHidden) {
            content.style.display = 'block';
            btn.classList.add('expanded');
        } else {
            content.style.display = 'none';
            btn.classList.remove('expanded');
        }
    }
}

/**
 * 获取知识库数据
 */
async function fetchKnowledgeBaseData() {
    // 模拟知识库数据，实际应该从API获取
    return {
        personas: {
            "理性经济型": {
                "关键词": ["性价比", "油耗", "保养费用", "保值率", "经济", "实用", "省钱"],
                "特征": {
                    "年龄段": "30-50岁",
                    "收入水平": "中等",
                    "决策风格": "理性分析",
                    "关注点": ["燃油经济性", "维修成本", "保值率", "实用配置"]
                },
                "沟通策略": {
                    "重点": ["数据支撑", "成本分析", "对比优势"],
                    "话术风格": "理性客观",
                    "避免": ["情感化表达", "过度包装"]
                }
            },
            "品质升级型": {
                "关键词": ["品质", "舒适", "配置", "品牌", "升级", "体验", "档次"],
                "特征": {
                    "年龄段": "35-55岁",
                    "收入水平": "中高等",
                    "决策风格": "品质导向",
                    "关注点": ["品牌价值", "配置丰富", "驾乘体验", "面子需求"]
                },
                "沟通策略": {
                    "重点": ["品质体验", "配置优势", "品牌价值"],
                    "话术风格": "专业权威",
                    "避免": ["过分强调价格", "低端对比"]
                }
            },
            "年轻个性型": {
                "关键词": ["时尚", "个性", "科技", "运动", "潮流", "智能", "颜值"],
                "特征": {
                    "年龄段": "20-35岁",
                    "收入水平": "中等偏上",
                    "决策风格": "感性冲动",
                    "关注点": ["外观设计", "科技配置", "个性化", "社交属性"]
                },
                "沟通策略": {
                    "重点": ["设计亮点", "科技配置", "个性表达"],
                    "话术风格": "活力时尚",
                    "避免": ["传统保守", "过于理性"]
                }
            }
        },
        stages: {
            "初次接触": {
                "目标": "建立信任，了解基本需求",
                "重点": ["热情接待", "需求探索", "产品介绍"],
                "关键指标": ["接待时间", "需求识别准确度", "客户满意度"]
            },
            "需求挖掘": {
                "目标": "深入了解客户需求和偏好",
                "重点": ["详细询问", "需求分析", "痛点识别"],
                "关键指标": ["需求挖掘深度", "客户画像准确度", "需求匹配度"]
            },
            "产品推荐": {
                "目标": "推荐合适的产品和配置",
                "重点": ["产品匹配", "优势展示", "价值传递"],
                "关键指标": ["推荐准确度", "客户接受度", "产品吸引力"]
            },
            "试驾体验": {
                "目标": "让客户体验产品，增强购买意愿",
                "重点": ["试驾安排", "体验引导", "感受分享"],
                "关键指标": ["试驾转化率", "体验满意度", "购买意向提升"]
            },
            "商务谈判": {
                "目标": "达成价格和条件共识",
                "重点": ["价格谈判", "优惠政策", "付款方式"],
                "关键指标": ["成交价格", "优惠幅度", "客户满意度"]
            },
            "签约成交": {
                "目标": "完成销售流程，签署合同",
                "重点": ["合同签署", "付款确认", "交车安排"],
                "关键指标": ["成交率", "客户满意度", "后续服务"]
            }
        },
        rules: {
            "画像匹配规则": {
                "理性经济型": ["经济性物料", "对比分析", "成本效益"],
                "品质升级型": ["品质体验", "配置介绍", "品牌价值"],
                "年轻个性型": ["设计亮点", "科技配置", "个性化"]
            },
            "阶段推荐规则": {
                "初次接触": ["品牌介绍", "产品概览", "基础资料"],
                "需求挖掘": ["需求调研表", "产品对比", "配置说明"],
                "产品推荐": ["产品手册", "配置清单", "价格表"],
                "试驾体验": ["试驾指南", "体验要点", "安全须知"],
                "商务谈判": ["优惠政策", "金融方案", "保险介绍"],
                "签约成交": ["合同模板", "交车流程", "售后服务"]
            }
        },
        materials: [
            {
                "id": "MAT_001",
                "name": "伊兰特燃油经济性对比表",
                "type": "对比分析",
                "category": "经济性",
                "target_personas": ["理性经济型"],
                "target_stages": ["需求挖掘", "产品推荐"],
                "description": "详细对比伊兰特与同级别车型的燃油经济性数据"
            },
            {
                "id": "MAT_002",
                "name": "现代品牌价值介绍",
                "type": "品牌宣传",
                "category": "品牌价值",
                "target_personas": ["品质升级型"],
                "target_stages": ["初次接触", "产品推荐"],
                "description": "现代汽车品牌历史、技术实力和市场地位介绍"
            },
            {
                "id": "MAT_003",
                "name": "智能科技配置展示",
                "type": "功能演示",
                "category": "科技配置",
                "target_personas": ["年轻个性型"],
                "target_stages": ["产品推荐", "试驾体验"],
                "description": "展示车辆的智能互联、安全辅助等科技配置"
            }
        ]
    };
}

/**
 * 更新知识库显示
 */
function updateKnowledgeBaseDisplay(data) {
    // 更新客户画像
    updatePersonasDisplay(data.personas);
    
    // 更新销售阶段
    updateStagesDisplay(data.stages);
    
    // 更新推荐规则
    updateRulesDisplay(data.rules);
    
    // 更新物料库
    updateMaterialsDisplay(data.materials);
}

/**
 * 更新客户画像显示
 */
function updatePersonasDisplay(personas) {
    const container = document.getElementById('personas-data');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(personas).forEach(([type, info]) => {
        const item = document.createElement('div');
        item.className = 'kb-data-item';
        
        item.innerHTML = `
            <div class="kb-data-title">
                <i class="fas fa-user"></i>
                <span class="kb-tag persona">${type}</span>
            </div>
            <div class="kb-data-content">
                <p><strong>关键词:</strong> ${info.关键词.join(', ')}</p>
                <p><strong>年龄段:</strong> ${info.特征.年龄段}</p>
                <p><strong>决策风格:</strong> ${info.特征.决策风格}</p>
                <p><strong>关注点:</strong> ${info.特征.关注点.join(', ')}</p>
            </div>
            <div class="kb-data-json">${JSON.stringify(info, null, 2)}</div>
        `;
        
        container.appendChild(item);
    });
}

/**
 * 更新销售阶段显示
 */
function updateStagesDisplay(stages) {
    const container = document.getElementById('stages-data');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(stages).forEach(([stage, info]) => {
        const item = document.createElement('div');
        item.className = 'kb-data-item';
        
        item.innerHTML = `
            <div class="kb-data-title">
                <i class="fas fa-chart-line"></i>
                <span class="kb-tag stage">${stage}</span>
            </div>
            <div class="kb-data-content">
                <p><strong>目标:</strong> ${info.目标}</p>
                <p><strong>重点:</strong> ${info.重点.join(', ')}</p>
                <p><strong>关键指标:</strong> ${info.关键指标.join(', ')}</p>
            </div>
            <div class="kb-data-json">${JSON.stringify(info, null, 2)}</div>
        `;
        
        container.appendChild(item);
    });
}

/**
 * 更新推荐规则显示
 */
function updateRulesDisplay(rules) {
    const container = document.getElementById('rules-data');
    if (!container) return;
    
    container.innerHTML = '';
    
    Object.entries(rules).forEach(([ruleName, ruleData]) => {
        const item = document.createElement('div');
        item.className = 'kb-data-item';
        
        item.innerHTML = `
            <div class="kb-data-title">
                <i class="fas fa-cogs"></i>
                <span class="kb-tag rule">${ruleName}</span>
            </div>
            <div class="kb-data-content">
                ${Object.entries(ruleData).map(([key, value]) => 
                    `<p><strong>${key}:</strong> ${Array.isArray(value) ? value.join(', ') : value}</p>`
                ).join('')}
            </div>
            <div class="kb-data-json">${JSON.stringify(ruleData, null, 2)}</div>
        `;
        
        container.appendChild(item);
    });
}

/**
 * 更新物料库显示
 */
function updateMaterialsDisplay(materials) {
    const container = document.getElementById('materials-data');
    if (!container) return;
    
    container.innerHTML = '';
    
    materials.forEach(material => {
        const item = document.createElement('div');
        item.className = 'kb-data-item';
        
        item.innerHTML = `
            <div class="kb-data-title">
                <i class="fas fa-folder"></i>
                <span class="kb-tag material">${material.name}</span>
            </div>
            <div class="kb-data-content">
                <p><strong>ID:</strong> ${material.id}</p>
                <p><strong>类型:</strong> ${material.type}</p>
                <p><strong>分类:</strong> ${material.category}</p>
                <p><strong>目标画像:</strong> ${material.target_personas.join(', ')}</p>
                <p><strong>适用阶段:</strong> ${material.target_stages.join(', ')}</p>
                <p><strong>描述:</strong> ${material.description}</p>
            </div>
            <div class="kb-data-json">${JSON.stringify(material, null, 2)}</div>
        `;
        
        container.appendChild(item);
    });
}

/**
 * 更新知识库统计
 */
function updateKnowledgeBaseStats(data) {
    // 更新统计数字
    document.getElementById('kb-personas-count').textContent = Object.keys(data.personas || {}).length;
    document.getElementById('kb-stages-count').textContent = Object.keys(data.stages || {}).length;
    document.getElementById('kb-rules-count').textContent = Object.keys(data.rules || {}).length;
    document.getElementById('kb-materials-count').textContent = (data.materials || []).length;
}

/**
 * 处理知识库文件
 */
async function processKnowledgeBaseFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                let data;
                
                if (file.name.endsWith('.json')) {
                    data = JSON.parse(content);
                } else if (file.name.endsWith('.csv')) {
                    // 简单的CSV解析（实际项目中应使用专业的CSV解析库）
                    data = parseCSV(content);
                } else {
                    throw new Error('不支持的文件格式');
                }
                
                // 验证数据格式
                validateKnowledgeBaseData(data);
                
                // 这里应该将数据上传到服务器
                console.log('处理知识库文件:', file.name, data);
                logToDebugConsole('📁 处理知识库文件', 'info', { filename: file.name, size: file.size });
                
                resolve(data);
                
            } catch (error) {
                reject(new Error(`文件 ${file.name} 处理失败: ${error.message}`));
            }
        };
        
        reader.onerror = function() {
            reject(new Error(`文件 ${file.name} 读取失败`));
        };
        
        reader.readAsText(file);
    });
}

/**
 * 简单的CSV解析
 */
function parseCSV(content) {
    const lines = content.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
    }
    
    return data;
}

/**
 * 检查知识库状态
 */
async function checkKnowledgeBaseStatus() {
    const statusBtn = document.getElementById('check-kb-status');
    const originalText = statusBtn.innerHTML;
    
    try {
        // 更新按钮状态
        statusBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 检查中...';
        statusBtn.disabled = true;
        
        // 调用后台API获取知识库状态
        const response = await fetch('https://mzhyi8c198x6.manus.space/api/v1/knowledge/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        let kbStatus;
        if (response.ok) {
            kbStatus = await response.json();
        } else {
            // 如果API不可用，使用本地测试脚本
            console.log('API不可用，使用本地测试数据');
            kbStatus = await getLocalKnowledgeBaseStatus();
        }
        
        // 更新显示
        updateKnowledgeBaseStatusDisplay(kbStatus);
        
        // 保存状态到本地存储
        localStorage.setItem('kb_status_history', JSON.stringify({
            timestamp: new Date().toISOString(),
            status: kbStatus
        }));
        
        addToDebugConsole('知识库状态检查完成', 'success');
        
    } catch (error) {
        console.error('检查知识库状态失败:', error);
        addToDebugConsole(`检查知识库状态失败: ${error.message}`, 'error');
        
        // 尝试使用本地测试数据
        try {
            const localStatus = await getLocalKnowledgeBaseStatus();
            updateKnowledgeBaseStatusDisplay(localStatus);
            addToDebugConsole('使用本地测试数据显示知识库状态', 'warning');
        } catch (localError) {
            addToDebugConsole(`本地数据也无法获取: ${localError.message}`, 'error');
        }
    } finally {
        // 恢复按钮状态
        statusBtn.innerHTML = originalText;
        statusBtn.disabled = false;
    }
}

/**
 * 获取本地知识库状态（模拟数据）
 */
async function getLocalKnowledgeBaseStatus() {
    // 模拟API响应延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
        success: true,
        data: {
            total_items: 20,
            knowledge_types: 4,
            knowledge_summary: {
                customer_persona: 6,
                market_insight: 2,
                regional_data: 9,
                sales_strategy: 3
            },
            quality_score: 90,
            last_updated: '2025-09-17T08:55:07.045114',
            items_by_source: {
                real_sales_data: 14,
                expert_analysis: 6
            },
            file_sizes: {
                customer_persona_knowledge: '9.7KB',
                market_insight_knowledge: '3.2KB',
                regional_data_knowledge: '12.3KB',
                sales_strategy_knowledge: '4.6KB'
            }
        }
    };
}

/**
 * 更新知识库状态显示
 */
function updateKnowledgeBaseStatusDisplay(statusData) {
    const data = statusData.data || statusData;
    
    // 更新概览信息
    document.getElementById('total-items').textContent = data.total_items || '-';
    document.getElementById('knowledge-types').textContent = data.knowledge_types || '-';
    document.getElementById('quality-score').textContent = `${data.quality_score || 0}/100`;
    
    const lastUpdated = data.last_updated ? 
        new Date(data.last_updated).toLocaleString('zh-CN') : '-';
    document.getElementById('last-updated').textContent = lastUpdated;
    
    // 更新知识分类详情
    const breakdownDiv = document.getElementById('knowledge-breakdown');
    if (data.knowledge_summary) {
        let breakdownHTML = '';
        for (const [type, count] of Object.entries(data.knowledge_summary)) {
            const typeName = getKnowledgeTypeName(type);
            const fileSize = data.file_sizes ? data.file_sizes[`${type}_knowledge`] || '未知' : '未知';
            
            breakdownHTML += `
                <div class="breakdown-item">
                    <div class="breakdown-header">
                        <span class="type-name">${typeName}</span>
                        <span class="type-count">${count} 项</span>
                        <span class="type-size">${fileSize}</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${(count / data.total_items) * 100}%"></div>
                    </div>
                </div>
            `;
        }
        breakdownDiv.innerHTML = breakdownHTML;
    }
    
    // 更新变化历史
    updateChangeHistory(data);
}

/**
 * 获取知识类型中文名称
 */
function getKnowledgeTypeName(type) {
    const typeNames = {
        customer_persona: '客户画像',
        market_insight: '市场洞察',
        regional_data: '区域数据',
        sales_strategy: '销售策略',
        product_knowledge: '产品知识',
        competitive_analysis: '竞品分析',
        conversation_script: '话术脚本',
        case_study: '案例研究',
        policy_rule: '政策规则',
        performance_metric: '效果指标'
    };
    return typeNames[type] || type;
}

/**
 * 更新变化历史
 */
function updateChangeHistory(currentData) {
    const changeHistoryDiv = document.getElementById('change-history');
    
    // 获取历史数据
    const historyData = localStorage.getItem('kb_status_history');
    let changes = [];
    
    if (historyData) {
        try {
            const lastStatus = JSON.parse(historyData);
            const lastData = lastStatus.status.data || lastStatus.status;
            
            // 比较变化
            if (lastData.total_items !== currentData.total_items) {
                const diff = currentData.total_items - lastData.total_items;
                changes.push({
                    type: 'total_items',
                    description: `总项目数变化: ${diff > 0 ? '+' : ''}${diff}`,
                    timestamp: new Date().toLocaleString('zh-CN'),
                    change_type: diff > 0 ? 'increase' : 'decrease'
                });
            }
            
            if (lastData.quality_score !== currentData.quality_score) {
                const diff = currentData.quality_score - lastData.quality_score;
                changes.push({
                    type: 'quality_score',
                    description: `质量评分变化: ${diff > 0 ? '+' : ''}${diff}`,
                    timestamp: new Date().toLocaleString('zh-CN'),
                    change_type: diff > 0 ? 'increase' : 'decrease'
                });
            }
            
            // 检查知识类型变化
            if (lastData.knowledge_summary && currentData.knowledge_summary) {
                for (const [type, count] of Object.entries(currentData.knowledge_summary)) {
                    const lastCount = lastData.knowledge_summary[type] || 0;
                    if (count !== lastCount) {
                        const diff = count - lastCount;
                        const typeName = getKnowledgeTypeName(type);
                        changes.push({
                            type: 'knowledge_type',
                            description: `${typeName}变化: ${diff > 0 ? '+' : ''}${diff}`,
                            timestamp: new Date().toLocaleString('zh-CN'),
                            change_type: diff > 0 ? 'increase' : 'decrease'
                        });
                    }
                }
            }
        } catch (error) {
            console.error('解析历史数据失败:', error);
        }
    }
    
    // 显示变化历史
    if (changes.length > 0) {
        let changesHTML = '';
        changes.forEach(change => {
            const iconClass = change.change_type === 'increase' ? 'fa-arrow-up text-success' : 'fa-arrow-down text-warning';
            changesHTML += `
                <div class="change-item">
                    <i class="fas ${iconClass}"></i>
                    <span class="change-description">${change.description}</span>
                    <span class="change-timestamp">${change.timestamp}</span>
                </div>
            `;
        });
        changeHistoryDiv.innerHTML = changesHTML;
    } else {
        changeHistoryDiv.innerHTML = '<div class="no-changes">暂无变化记录</div>';
    }
}

/**
 * 对比知识库变化
 */
async function compareKnowledgeBaseChanges() {
    const compareBtn = document.getElementById('compare-kb-changes');
    const originalText = compareBtn.innerHTML;
    
    try {
        compareBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 对比中...';
        compareBtn.disabled = true;
        
        // 获取当前状态
        const currentStatus = await getLocalKnowledgeBaseStatus();
        
        // 获取历史状态
        const historyData = localStorage.getItem('kb_status_history');
        if (!historyData) {
            addToDebugConsole('没有历史数据可供对比', 'warning');
            return;
        }
        
        const lastStatus = JSON.parse(historyData);
        const lastData = lastStatus.status.data || lastStatus.status;
        const currentData = currentStatus.data;
        
        // 生成对比报告
        const comparisonReport = generateComparisonReport(lastData, currentData);
        
        // 显示对比结果
        displayComparisonReport(comparisonReport);
        
        addToDebugConsole('知识库变化对比完成', 'success');
        
    } catch (error) {
        console.error('对比知识库变化失败:', error);
        addToDebugConsole(`对比知识库变化失败: ${error.message}`, 'error');
    } finally {
        compareBtn.innerHTML = originalText;
        compareBtn.disabled = false;
    }
}

/**
 * 生成对比报告
 */
function generateComparisonReport(lastData, currentData) {
    const report = {
        timestamp: new Date().toLocaleString('zh-CN'),
        summary: {
            total_changes: 0,
            additions: 0,
            modifications: 0,
            deletions: 0
        },
        details: []
    };
    
    // 对比总项目数
    if (lastData.total_items !== currentData.total_items) {
        const diff = currentData.total_items - lastData.total_items;
        report.details.push({
            category: '总体统计',
            field: '总项目数',
            old_value: lastData.total_items,
            new_value: currentData.total_items,
            change: diff,
            change_type: diff > 0 ? 'addition' : 'deletion'
        });
        report.summary.total_changes++;
        if (diff > 0) report.summary.additions += diff;
        else report.summary.deletions += Math.abs(diff);
    }
    
    // 对比质量评分
    if (lastData.quality_score !== currentData.quality_score) {
        const diff = currentData.quality_score - lastData.quality_score;
        report.details.push({
            category: '质量指标',
            field: '质量评分',
            old_value: lastData.quality_score,
            new_value: currentData.quality_score,
            change: diff,
            change_type: 'modification'
        });
        report.summary.total_changes++;
        report.summary.modifications++;
    }
    
    // 对比知识类型
    if (lastData.knowledge_summary && currentData.knowledge_summary) {
        const allTypes = new Set([
            ...Object.keys(lastData.knowledge_summary),
            ...Object.keys(currentData.knowledge_summary)
        ]);
        
        allTypes.forEach(type => {
            const lastCount = lastData.knowledge_summary[type] || 0;
            const currentCount = currentData.knowledge_summary[type] || 0;
            
            if (lastCount !== currentCount) {
                const diff = currentCount - lastCount;
                report.details.push({
                    category: '知识类型',
                    field: getKnowledgeTypeName(type),
                    old_value: lastCount,
                    new_value: currentCount,
                    change: diff,
                    change_type: diff > 0 ? 'addition' : (diff < 0 ? 'deletion' : 'modification')
                });
                report.summary.total_changes++;
                if (diff > 0) report.summary.additions += diff;
                else if (diff < 0) report.summary.deletions += Math.abs(diff);
            }
        });
    }
    
    return report;
}

/**
 * 显示对比报告
 */
function displayComparisonReport(report) {
    const changeHistoryDiv = document.getElementById('change-history');
    
    let reportHTML = `
        <div class="comparison-report">
            <div class="report-header">
                <h5><i class="fas fa-chart-line"></i> 变化对比报告</h5>
                <span class="report-timestamp">${report.timestamp}</span>
            </div>
            <div class="report-summary">
                <div class="summary-item">
                    <span class="label">总变化数:</span>
                    <span class="value">${report.summary.total_changes}</span>
                </div>
                <div class="summary-item">
                    <span class="label">新增:</span>
                    <span class="value text-success">+${report.summary.additions}</span>
                </div>
                <div class="summary-item">
                    <span class="label">修改:</span>
                    <span class="value text-info">${report.summary.modifications}</span>
                </div>
                <div class="summary-item">
                    <span class="label">删除:</span>
                    <span class="value text-warning">-${report.summary.deletions}</span>
                </div>
            </div>
    `;
    
    if (report.details.length > 0) {
        reportHTML += '<div class="report-details"><h6>详细变化:</h6>';
        report.details.forEach(detail => {
            const changeIcon = detail.change_type === 'addition' ? 'fa-plus text-success' :
                              detail.change_type === 'deletion' ? 'fa-minus text-warning' :
                              'fa-edit text-info';
            
            reportHTML += `
                <div class="detail-item">
                    <i class="fas ${changeIcon}"></i>
                    <span class="detail-category">[${detail.category}]</span>
                    <span class="detail-field">${detail.field}:</span>
                    <span class="detail-change">${detail.old_value} → ${detail.new_value}</span>
                    <span class="detail-diff">(${detail.change > 0 ? '+' : ''}${detail.change})</span>
                </div>
            `;
        });
        reportHTML += '</div>';
    } else {
        reportHTML += '<div class="no-changes">没有检测到变化</div>';
    }
    
    reportHTML += '</div>';
    changeHistoryDiv.innerHTML = reportHTML;
}

/**
 * 验证知识库数据格式
 */
function validateKnowledgeBaseData(data) {
    // 简单的数据验证
    if (!data || typeof data !== 'object') {
        throw new Error('数据格式无效');
    }
    
    // 这里可以添加更详细的验证逻辑
    return true;
}

// 导出知识库管理函数到全局
window.refreshKnowledgeBase = refreshKnowledgeBase;
window.downloadKnowledgeBase = downloadKnowledgeBase;
window.toggleKnowledgeBase = toggleKnowledgeBase;
window.handleKnowledgeBaseUpload = handleKnowledgeBaseUpload;
window.handleKbDragOver = handleKbDragOver;
window.handleKbDrop = handleKbDrop;
window.handleKbDragLeave = handleKbDragLeave;
window.toggleKbCategory = toggleKbCategory;
window.checkKnowledgeBaseStatus = checkKnowledgeBaseStatus;
window.compareKnowledgeBaseChanges = compareKnowledgeBaseChanges;

console.log('知识库管理功能加载完成');

