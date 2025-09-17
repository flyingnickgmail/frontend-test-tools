/**
 * AI营销助手测试平台主应用
 */

// 全局变量
let apiClient = null;
let testRunner = null;
let uiController = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面加载完成，开始初始化...');
    
    try {
        // 初始化组件
        initializeApp();
        
        // 绑定事件监听器
        bindEventListeners();
        
        console.log('应用初始化成功');
    } catch (error) {
        console.error('应用初始化失败:', error);
    }
});

/**
 * 初始化应用
 */
function initializeApp() {
    // 创建API客户端
    const baseURL = document.getElementById('api-base-url').value;
    apiClient = new AIMarketingAPIClient(baseURL);
    
    // 创建测试运行器
    testRunner = new TestRunner(apiClient);
    
    // 创建UI控制器
    uiController = new UIController();
    
    // 设置全局引用
    window.apiClient = apiClient;
    window.testRunner = testRunner;
    window.uiController = uiController;
    
    console.log('组件初始化完成');
}

/**
 * 绑定事件监听器
 */
function bindEventListeners() {
    // 连接API按钮
    const connectBtn = document.getElementById('connect-api');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectAPI);
        console.log('连接API按钮事件已绑定');
    }
    
    // 健康检查按钮
    const healthBtn = document.getElementById('health-check');
    if (healthBtn) {
        healthBtn.addEventListener('click', runHealthCheck);
        console.log('健康检查按钮事件已绑定');
    }
    
    // 认证测试按钮
    const authBtn = document.getElementById('auth-test');
    if (authBtn) {
        authBtn.addEventListener('click', runAuthTest);
        console.log('认证测试按钮事件已绑定');
    }
    
    // 分析客户按钮
    const analyzeBtn = document.getElementById('analyze-customer');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeCustomer);
        console.log('分析客户按钮事件已绑定');
    }
    
    // 一键运行所有测试按钮
    const runAllBtn = document.getElementById('run-all-tests');
    if (runAllBtn) {
        runAllBtn.addEventListener('click', runAllTests);
        console.log('一键测试按钮事件已绑定');
    }
    
    // 物料反馈按钮
    const materialFeedbackBtn = document.getElementById('submit-material-feedback');
    if (materialFeedbackBtn) {
        materialFeedbackBtn.addEventListener('click', submitMaterialFeedback);
        console.log('物料反馈按钮事件已绑定');
    }
    
    // 成交反馈按钮
    const dealFeedbackBtn = document.getElementById('submit-deal-feedback');
    if (dealFeedbackBtn) {
        dealFeedbackBtn.addEventListener('click', submitDealFeedback);
        console.log('成交反馈按钮事件已绑定');
    }
}

/**
 * 连接API
 */
async function connectAPI() {
    const connectBtn = document.getElementById('connect-api');
    const statusIndicator = document.getElementById('api-status-indicator');
    
    try {
        // 更新按钮状态
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 连接中...';
        connectBtn.disabled = true;
        
        // 更新状态指示器
        statusIndicator.className = 'status-indicator connecting';
        statusIndicator.innerHTML = '<i class="fas fa-circle"></i> 连接中';
        
        // 获取配置
        const baseURL = document.getElementById('api-base-url').value;
        const apiKey = document.getElementById('api-key').value;
        const apiSecret = document.getElementById('api-secret').value;
        
        // 更新API客户端配置
        apiClient.baseURL = baseURL;
        apiClient.apiKey = apiKey;
        apiClient.apiSecret = apiSecret;
        
        // 测试连接
        const healthResult = await apiClient.healthCheck();
        console.log('健康检查结果:', healthResult);
        
        // 测试认证
        const authResult = await apiClient.authenticate();
        console.log('认证结果:', authResult);
        
        // 连接成功
        statusIndicator.className = 'status-indicator online';
        statusIndicator.innerHTML = '<i class="fas fa-circle"></i> 在线';
        
        connectBtn.innerHTML = '<i class="fas fa-check"></i> 已连接';
        connectBtn.disabled = false;
        
        // 显示成功消息
        uiController.showNotification('API连接成功！', 'success');
        
        // 更新测试结果
        uiController.addTestResult('API连接测试', true, '连接成功', Date.now() - startTime);
        
    } catch (error) {
        console.error('API连接失败:', error);
        
        // 连接失败
        statusIndicator.className = 'status-indicator offline';
        statusIndicator.innerHTML = '<i class="fas fa-circle"></i> 离线';
        
        connectBtn.innerHTML = '<i class="fas fa-plug"></i> 连接API';
        connectBtn.disabled = false;
        
        // 显示错误消息
        uiController.showNotification('API连接失败: ' + error.message, 'error');
        
        // 更新测试结果
        uiController.addTestResult('API连接测试', false, error.message, Date.now() - startTime);
    }
}

/**
 * 运行健康检查
 */
async function runHealthCheck() {
    const startTime = Date.now();
    const btn = document.getElementById('health-check');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 检查中...';
        btn.disabled = true;
        
        const result = await apiClient.healthCheck();
        console.log('健康检查结果:', result);
        
        // 显示结果
        uiController.addTestResult('健康检查', true, '服务正常', Date.now() - startTime);
        uiController.displayResult('健康检查结果', result);
        
        btn.innerHTML = '<i class="fas fa-heart"></i> 健康检查';
        btn.disabled = false;
        
    } catch (error) {
        console.error('健康检查失败:', error);
        
        uiController.addTestResult('健康检查', false, error.message, Date.now() - startTime);
        uiController.showNotification('健康检查失败: ' + error.message, 'error');
        
        btn.innerHTML = '<i class="fas fa-heart"></i> 健康检查';
        btn.disabled = false;
    }
}

/**
 * 运行认证测试
 */
async function runAuthTest() {
    const startTime = Date.now();
    const btn = document.getElementById('auth-test');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 认证中...';
        btn.disabled = true;
        
        const result = await apiClient.authenticate();
        console.log('认证结果:', result);
        
        // 显示结果
        uiController.addTestResult('认证测试', true, '认证成功', Date.now() - startTime);
        uiController.displayResult('认证测试结果', result);
        
        btn.innerHTML = '<i class="fas fa-key"></i> 认证测试';
        btn.disabled = false;
        
    } catch (error) {
        console.error('认证失败:', error);
        
        uiController.addTestResult('认证测试', false, error.message, Date.now() - startTime);
        uiController.showNotification('认证失败: ' + error.message, 'error');
        
        btn.innerHTML = '<i class="fas fa-key"></i> 认证测试';
        btn.disabled = false;
    }
}

/**
 * 分析客户
 */
async function analyzeCustomer() {
    const startTime = Date.now();
    const btn = document.getElementById('analyze-customer');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
        btn.disabled = true;
        
        // 获取输入数据
        const conversationText = document.getElementById('conversation-text').value;
        const advisorNotes = document.getElementById('advisor-notes').value;
        const customerStage = document.getElementById('customer-stage').value;
        
        const requestData = {
            conversation_text: conversationText,
            advisor_notes: advisorNotes,
            customer_stage: customerStage
        };
        
        console.log('分析请求数据:', requestData);
        
        const result = await apiClient.analyzeCustomer(requestData);
        console.log('客户分析结果:', result);
        
        // 自动填充会话ID
        if (result.data && result.data.session_id) {
            const sessionIdInput = document.getElementById('session-id');
            if (sessionIdInput) {
                sessionIdInput.value = result.data.session_id;
            }
        }
        
        // 显示结果
        uiController.addTestResult('客户分析', true, '分析完成', Date.now() - startTime);
        uiController.displayResult('客户分析结果', result);
        
        // 自动滚动到结果区域
        document.getElementById('test-results').scrollIntoView({ 
            behavior: 'smooth' 
        });
        
        btn.innerHTML = '<i class="fas fa-user-check"></i> 分析客户';
        btn.disabled = false;
        
        uiController.showNotification('客户分析完成！', 'success');
        
    } catch (error) {
        console.error('客户分析失败:', error);
        
        uiController.addTestResult('客户分析', false, error.message, Date.now() - startTime);
        uiController.showNotification('客户分析失败: ' + error.message, 'error');
        
        btn.innerHTML = '<i class="fas fa-user-check"></i> 分析客户';
        btn.disabled = false;
    }
}

/**
 * 运行所有测试
 */
async function runAllTests() {
    const btn = document.getElementById('run-all-tests');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 测试中...';
        btn.disabled = true;
        
        // 清空之前的结果
        uiController.clearResults();
        
        // 依次运行所有测试
        await connectAPI();
        await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
        
        await runHealthCheck();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await runAuthTest();
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await analyzeCustomer();
        
        btn.innerHTML = '<i class="fas fa-play"></i> 一键运行所有测试';
        btn.disabled = false;
        
        uiController.showNotification('所有测试完成！', 'success');
        
    } catch (error) {
        console.error('测试运行失败:', error);
        
        btn.innerHTML = '<i class="fas fa-play"></i> 一键运行所有测试';
        btn.disabled = false;
        
        uiController.showNotification('测试运行失败: ' + error.message, 'error');
    }
}

/**
 * 提交物料反馈
 */
async function submitMaterialFeedback() {
    const startTime = Date.now();
    const btn = document.getElementById('submit-material-feedback');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
        btn.disabled = true;
        
        const sessionId = document.getElementById('session-id').value;
        const materialFeedback = document.getElementById('material-feedback').value;
        
        if (!sessionId) {
            throw new Error('请先进行客户分析获取会话ID');
        }
        
        const requestData = {
            session_id: sessionId,
            feedback_data: {
                material_used: materialFeedback,
                effectiveness: 'good',
                customer_response: 'positive'
            }
        };
        
        const result = await apiClient.submitMaterialFeedback(requestData);
        console.log('物料反馈结果:', result);
        
        uiController.addTestResult('物料反馈', true, '提交成功', Date.now() - startTime);
        uiController.displayResult('物料反馈结果', result);
        
        btn.innerHTML = '<i class="fas fa-comment"></i> 提交物料反馈';
        btn.disabled = false;
        
        uiController.showNotification('物料反馈提交成功！', 'success');
        
    } catch (error) {
        console.error('物料反馈提交失败:', error);
        
        uiController.addTestResult('物料反馈', false, error.message, Date.now() - startTime);
        uiController.showNotification('物料反馈提交失败: ' + error.message, 'error');
        
        btn.innerHTML = '<i class="fas fa-comment"></i> 提交物料反馈';
        btn.disabled = false;
    }
}

/**
 * 提交成交反馈
 */
async function submitDealFeedback() {
    const startTime = Date.now();
    const btn = document.getElementById('submit-deal-feedback');
    
    try {
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
        btn.disabled = true;
        
        const sessionId = document.getElementById('session-id').value;
        const dealResult = document.getElementById('deal-result').value;
        
        if (!sessionId) {
            throw new Error('请先进行客户分析获取会话ID');
        }
        
        const requestData = {
            session_id: sessionId,
            deal_data: {
                deal_closed: dealResult === 'success',
                deal_amount: dealResult === 'success' ? 78000 : 0,
                close_reason: dealResult === 'success' ? '价格合适' : '需要考虑'
            }
        };
        
        const result = await apiClient.submitDealFeedback(requestData);
        console.log('成交反馈结果:', result);
        
        uiController.addTestResult('成交反馈', true, '提交成功', Date.now() - startTime);
        uiController.displayResult('成交反馈结果', result);
        
        btn.innerHTML = '<i class="fas fa-handshake"></i> 提交成交反馈';
        btn.disabled = false;
        
        uiController.showNotification('成交反馈提交成功！', 'success');
        
    } catch (error) {
        console.error('成交反馈提交失败:', error);
        
        uiController.addTestResult('成交反馈', false, error.message, Date.now() - startTime);
        uiController.showNotification('成交反馈提交失败: ' + error.message, 'error');
        
        btn.innerHTML = '<i class="fas fa-handshake"></i> 提交成交反馈';
        btn.disabled = false;
    }
}

// 导出全局函数供HTML调用
window.connectAPI = connectAPI;
window.runHealthCheck = runHealthCheck;
window.runAuthTest = runAuthTest;
window.analyzeCustomer = analyzeCustomer;
window.runAllTests = runAllTests;
window.submitMaterialFeedback = submitMaterialFeedback;
window.submitDealFeedback = submitDealFeedback;

console.log('主应用脚本加载完成');

