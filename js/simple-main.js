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
    const healthBtn = document.getElementById('health-check');
    if (healthBtn) {
        healthBtn.addEventListener('click', simpleHealthCheck);
        console.log('健康检查按钮事件已绑定');
    }
    
    // 认证测试按钮
    const authBtn = document.getElementById('auth-test');
    if (authBtn) {
        authBtn.addEventListener('click', simpleAuthTest);
        console.log('认证测试按钮事件已绑定');
    }
    
    // 分析客户按钮
    const analyzeBtn = document.getElementById('analyze-customer');
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
    const btn = document.getElementById('health-check');
    
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
    const btn = document.getElementById('auth-test');
    
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
    const btn = document.getElementById('analyze-customer');
    
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
        
        // 显示请求数据到控制台区域
        displayConsoleResult('📤 请求数据', requestData);
        
        // 调用API
        console.log('🔄 调用客户分析API...');
        const result = await apiClient.analyzeCustomer(requestData);
        console.log('📥 客户分析结果:', result);
        
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

// 导出全局函数
window.simpleConnectAPI = simpleConnectAPI;
window.simpleHealthCheck = simpleHealthCheck;
window.simpleAuthTest = simpleAuthTest;
window.simpleAnalyzeCustomer = simpleAnalyzeCustomer;
window.simpleRunAllTests = simpleRunAllTests;

console.log('简化版主应用脚本加载完成');



// 添加控制台清空按钮到全局函数
window.clearConsoleResults = clearConsoleResults;
window.displayConsoleResult = displayConsoleResult;

