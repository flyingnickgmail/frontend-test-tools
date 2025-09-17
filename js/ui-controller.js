/**
 * UI控制器
 */
class UIController {
    constructor(apiClient, testRunner) {
        this.apiClient = apiClient;
        this.testRunner = testRunner;
        this.elements = {};
        this.currentSessionId = null;
        
        this.initializeElements();
        this.bindEvents();
        this.setupTestRunnerCallbacks();
    }

    /**
     * 初始化DOM元素引用
     */
    initializeElements() {
        this.elements = {
            // API配置
            apiBaseUrl: document.getElementById('api-base-url'),
            apiKey: document.getElementById('api-key'),
            apiSecret: document.getElementById('api-secret'),
            connectApi: document.getElementById('connect-api'),
            apiStatusIndicator: document.getElementById('api-status-indicator'),
            apiUrl: document.getElementById('api-url'),

            // 自动化测试按钮
            runAllTests: document.getElementById('run-all-tests'),
            runBasicTests: document.getElementById('run-basic-tests'),
            runBusinessTests: document.getElementById('run-business-tests'),
            runPerformanceTests: document.getElementById('run-performance-tests'),

            // 手动测试按钮
            testHealth: document.getElementById('test-health'),
            testAuth: document.getElementById('test-auth'),
            testAnalyze: document.getElementById('test-analyze'),
            testMaterials: document.getElementById('test-materials'),

            // 测试数据管理
            loadSampleData: document.getElementById('load-sample-data'),
            clearTestData: document.getElementById('clear-test-data'),
            uploadTestData: document.getElementById('upload-test-data'),
            uploadDataBtn: document.getElementById('upload-data-btn'),

            // 手动测试输入
            conversationText: document.getElementById('conversation-text'),
            advisorNotes: document.getElementById('advisor-notes'),
            customerStage: document.getElementById('customer-stage'),
            sessionId: document.getElementById('session-id'),
            materialFeedback: document.getElementById('material-feedback'),
            conversionResult: document.getElementById('conversion-result'),
            manualAnalyze: document.getElementById('manual-analyze'),
            manualMaterialFeedback: document.getElementById('manual-material-feedback'),
            manualConversionFeedback: document.getElementById('manual-conversion-feedback'),

            // 测试结果显示
            testResults: document.getElementById('test-results'),
            clearResults: document.getElementById('clear-results'),
            exportResults: document.getElementById('export-results'),

            // 统计信息
            totalTests: document.getElementById('total-tests'),
            passedTests: document.getElementById('passed-tests'),
            failedTests: document.getElementById('failed-tests'),
            avgResponseTime: document.getElementById('avg-response-time'),
            progressFill: document.getElementById('progress-fill'),
            progressText: document.getElementById('progress-text'),

            // 状态信息
            lastTestTime: document.getElementById('last-test-time'),
            apiVersion: document.getElementById('api-version'),

            // 其他控件
            toggleManualTest: document.getElementById('toggle-manual-test'),
            manualTestContent: document.getElementById('manual-test-content'),
            showLogs: document.getElementById('show-logs'),
            showHelp: document.getElementById('show-help'),
            modal: document.getElementById('modal'),
            modalTitle: document.getElementById('modal-title'),
            modalBody: document.getElementById('modal-body'),
            modalClose: document.getElementById('modal-close')
        };
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // API连接
        this.elements.connectApi.addEventListener('click', () => this.connectToAPI());

        // 自动化测试
        this.elements.runAllTests.addEventListener('click', () => this.runAllTests());
        this.elements.runBasicTests.addEventListener('click', () => this.runBasicTests());
        this.elements.runBusinessTests.addEventListener('click', () => this.runBusinessTests());
        this.elements.runPerformanceTests.addEventListener('click', () => this.runPerformanceTests());

        // 手动测试
        this.elements.testHealth.addEventListener('click', () => this.testHealth());
        this.elements.testAuth.addEventListener('click', () => this.testAuth());
        this.elements.testAnalyze.addEventListener('click', () => this.testAnalyze());
        this.elements.testMaterials.addEventListener('click', () => this.testMaterials());

        // 手动输入测试
        this.elements.manualAnalyze.addEventListener('click', () => this.manualAnalyze());
        this.elements.manualMaterialFeedback.addEventListener('click', () => this.manualMaterialFeedback());
        this.elements.manualConversionFeedback.addEventListener('click', () => this.manualConversionFeedback());

        // 数据管理
        this.elements.loadSampleData.addEventListener('click', () => this.loadSampleData());
        this.elements.clearTestData.addEventListener('click', () => this.clearTestData());
        this.elements.uploadDataBtn.addEventListener('click', () => this.elements.uploadTestData.click());
        this.elements.uploadTestData.addEventListener('change', (e) => this.uploadTestData(e));

        // 结果管理
        this.elements.clearResults.addEventListener('click', () => this.clearResults());
        this.elements.exportResults.addEventListener('click', () => this.exportResults());

        // UI控制
        this.elements.toggleManualTest.addEventListener('click', () => this.toggleManualTest());
        this.elements.showLogs.addEventListener('click', () => this.showLogs());
        this.elements.showHelp.addEventListener('click', () => this.showHelp());
        this.elements.modalClose.addEventListener('click', () => this.closeModal());

        // 模态框点击外部关闭
        this.elements.modal.addEventListener('click', (e) => {
            if (e.target === this.elements.modal) {
                this.closeModal();
            }
        });
    }

    /**
     * 设置测试运行器回调
     */
    setupTestRunnerCallbacks() {
        this.testRunner.onTestStart = (test) => {
            this.addTestResult({
                name: test.name,
                type: test.type,
                description: test.description,
                status: 'running',
                timestamp: new Date().toISOString()
            });
        };

        this.testRunner.onTestComplete = (result) => {
            this.updateTestResult(result);
            this.updateStatistics();
        };

        this.testRunner.onTestError = (result) => {
            this.updateTestResult(result);
            this.updateStatistics();
        };

        this.testRunner.onProgressUpdate = (current, total) => {
            this.updateProgress(current, total);
        };
    }

    // ==================== API连接 ====================

    /**
     * 连接到API
     */
    async connectToAPI() {
        const baseUrl = this.elements.apiBaseUrl.value.trim();
        const apiKey = this.elements.apiKey.value.trim();
        const secret = this.elements.apiSecret.value.trim();

        if (!baseUrl || !apiKey || !secret) {
            this.showNotification('请填写完整的API配置信息', 'error');
            return;
        }

        this.setButtonLoading(this.elements.connectApi, true);
        this.updateApiStatus('testing', '连接中...');

        try {
            this.apiClient.setBaseURL(baseUrl);
            this.apiClient.setCredentials(apiKey, secret);

            // 测试连接
            const healthResult = await this.apiClient.healthCheck();
            const authResult = await this.apiClient.authenticate();

            if (healthResult && authResult) {
                this.updateApiStatus('online', '已连接');
                this.elements.apiUrl.textContent = baseUrl;
                this.showNotification('API连接成功', 'success');
                
                // 获取API版本信息
                try {
                    const stats = await this.apiClient.getSystemStats();
                    if (stats.data && stats.data.version) {
                        this.elements.apiVersion.textContent = `API版本: ${stats.data.version}`;
                    }
                } catch (e) {
                    console.warn('无法获取API版本信息:', e);
                }
            } else {
                throw new Error('API连接测试失败');
            }
        } catch (error) {
            this.updateApiStatus('offline', '连接失败');
            this.showNotification(`API连接失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.connectApi, false);
        }
    }

    /**
     * 更新API状态
     */
    updateApiStatus(status, text) {
        const indicator = this.elements.apiStatusIndicator;
        indicator.className = `status-indicator ${status}`;
        
        const icon = status === 'online' ? 'fa-circle' : 
                    status === 'testing' ? 'fa-spinner fa-spin' : 'fa-circle';
        
        indicator.innerHTML = `<i class="fas ${icon}"></i> ${text}`;
    }

    // ==================== 自动化测试 ====================

    /**
     * 运行所有测试
     */
    async runAllTests() {
        if (this.testRunner.isRunning) {
            this.showNotification('测试正在运行中，请等待完成', 'warning');
            return;
        }

        this.setButtonLoading(this.elements.runAllTests, true);
        this.clearResults();

        try {
            const report = await this.testRunner.runAllTests();
            this.showNotification(`所有测试完成: ${report.summary.passed}/${report.summary.total} 通过`, 'info');
            this.elements.lastTestTime.textContent = `最后测试: ${new Date().toLocaleString()}`;
        } catch (error) {
            this.showNotification(`测试运行失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.runAllTests, false);
        }
    }

    /**
     * 运行基础测试
     */
    async runBasicTests() {
        if (this.testRunner.isRunning) {
            this.showNotification('测试正在运行中，请等待完成', 'warning');
            return;
        }

        this.setButtonLoading(this.elements.runBasicTests, true);

        try {
            const results = await this.testRunner.runBasicTests();
            const passed = results.filter(r => r.success).length;
            this.showNotification(`基础测试完成: ${passed}/${results.length} 通过`, 'info');
        } catch (error) {
            this.showNotification(`基础测试失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.runBasicTests, false);
        }
    }

    /**
     * 运行业务测试
     */
    async runBusinessTests() {
        if (this.testRunner.isRunning) {
            this.showNotification('测试正在运行中，请等待完成', 'warning');
            return;
        }

        this.setButtonLoading(this.elements.runBusinessTests, true);

        try {
            const results = await this.testRunner.runBusinessTests();
            const passed = results.filter(r => r.success).length;
            this.showNotification(`业务测试完成: ${passed}/${results.length} 通过`, 'info');
        } catch (error) {
            this.showNotification(`业务测试失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.runBusinessTests, false);
        }
    }

    /**
     * 运行性能测试
     */
    async runPerformanceTests() {
        if (this.testRunner.isRunning) {
            this.showNotification('测试正在运行中，请等待完成', 'warning');
            return;
        }

        this.setButtonLoading(this.elements.runPerformanceTests, true);

        try {
            const results = await this.testRunner.runPerformanceTests();
            const passed = results.filter(r => r.success).length;
            this.showNotification(`性能测试完成: ${passed}/${results.length} 通过`, 'info');
        } catch (error) {
            this.showNotification(`性能测试失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.runPerformanceTests, false);
        }
    }

    // ==================== 手动测试 ====================

    /**
     * 健康检查测试
     */
    async testHealth() {
        this.setButtonLoading(this.elements.testHealth, true);

        try {
            const result = await this.apiClient.healthCheck();
            this.addTestResult({
                name: '健康检查',
                type: 'health',
                success: true,
                result: result,
                timestamp: new Date().toISOString()
            });
            this.showNotification('健康检查通过', 'success');
        } catch (error) {
            this.addTestResult({
                name: '健康检查',
                type: 'health',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.showNotification(`健康检查失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.testHealth, false);
            this.updateStatistics();
        }
    }

    /**
     * 认证测试
     */
    async testAuth() {
        this.setButtonLoading(this.elements.testAuth, true);

        try {
            const result = await this.apiClient.authenticate();
            this.addTestResult({
                name: '认证测试',
                type: 'auth',
                success: true,
                result: result,
                timestamp: new Date().toISOString()
            });
            this.showNotification('认证测试通过', 'success');
        } catch (error) {
            this.addTestResult({
                name: '认证测试',
                type: 'auth',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.showNotification(`认证测试失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.testAuth, false);
            this.updateStatistics();
        }
    }

    /**
     * 客户分析测试
     */
    async testAnalyze() {
        this.setButtonLoading(this.elements.testAnalyze, true);

        try {
            const result = await this.apiClient.analyzeCustomer(
                '我想了解一下这款车的性价比如何',
                '客户初步咨询',
                '需求挖掘'
            );
            this.addTestResult({
                name: '客户分析测试',
                type: 'analyze',
                success: true,
                result: result,
                timestamp: new Date().toISOString()
            });
            this.showNotification('客户分析测试通过', 'success');
        } catch (error) {
            this.addTestResult({
                name: '客户分析测试',
                type: 'analyze',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.showNotification(`客户分析测试失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.testAnalyze, false);
            this.updateStatistics();
        }
    }

    /**
     * 物料获取测试
     */
    async testMaterials() {
        this.setButtonLoading(this.elements.testMaterials, true);

        try {
            const result = await this.apiClient.getMaterials();
            this.addTestResult({
                name: '物料获取测试',
                type: 'materials',
                success: true,
                result: result,
                timestamp: new Date().toISOString()
            });
            this.showNotification('物料获取测试通过', 'success');
        } catch (error) {
            this.addTestResult({
                name: '物料获取测试',
                type: 'materials',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.showNotification(`物料获取测试失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.testMaterials, false);
            this.updateStatistics();
        }
    }

    // ==================== 手动输入测试 ====================

    /**
     * 手动客户分析
     */
    async manualAnalyze() {
        const conversationText = this.elements.conversationText.value.trim();
        const advisorNotes = this.elements.advisorNotes.value.trim();
        const customerStage = this.elements.customerStage.value;

        if (!conversationText) {
            this.showNotification('请输入对话内容', 'warning');
            return;
        }

        this.setButtonLoading(this.elements.manualAnalyze, true);

        try {
            const result = await this.apiClient.analyzeCustomer(
                conversationText,
                advisorNotes,
                customerStage,
                {
                    customer_id: `MANUAL_C${Date.now()}`,
                    advisor_id: `MANUAL_A${Date.now()}`
                }
            );

            // 保存会话ID用于后续反馈
            if (result.data && result.data.session_id) {
                this.currentSessionId = result.data.session_id;
                this.elements.sessionId.value = this.currentSessionId;
            }

            this.addTestResult({
                name: '手动客户分析',
                type: 'manual_analyze',
                success: true,
                result: result,
                timestamp: new Date().toISOString()
            });

            this.showNotification('客户分析完成', 'success');
        } catch (error) {
            this.addTestResult({
                name: '手动客户分析',
                type: 'manual_analyze',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.showNotification(`客户分析失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.manualAnalyze, false);
            this.updateStatistics();
        }
    }

    /**
     * 手动物料反馈
     */
    async manualMaterialFeedback() {
        const sessionId = this.elements.sessionId.value.trim();
        const feedbackText = this.elements.materialFeedback.value.trim();

        if (!sessionId) {
            this.showNotification('请先进行客户分析获取会话ID', 'warning');
            return;
        }

        if (!feedbackText) {
            this.showNotification('请输入物料反馈内容', 'warning');
            return;
        }

        this.setButtonLoading(this.elements.manualMaterialFeedback, true);

        try {
            let materialFeedback;
            try {
                materialFeedback = JSON.parse(feedbackText);
            } catch (e) {
                throw new Error('物料反馈格式错误，请输入有效的JSON格式');
            }

            const result = await this.apiClient.submitMaterialFeedback(sessionId, materialFeedback);

            this.addTestResult({
                name: '手动物料反馈',
                type: 'manual_material_feedback',
                success: true,
                result: result,
                timestamp: new Date().toISOString()
            });

            this.showNotification('物料反馈提交成功', 'success');
        } catch (error) {
            this.addTestResult({
                name: '手动物料反馈',
                type: 'manual_material_feedback',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.showNotification(`物料反馈失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.manualMaterialFeedback, false);
            this.updateStatistics();
        }
    }

    /**
     * 手动成交反馈
     */
    async manualConversionFeedback() {
        const sessionId = this.elements.sessionId.value.trim();
        const resultText = this.elements.conversionResult.value.trim();

        if (!sessionId) {
            this.showNotification('请先进行客户分析获取会话ID', 'warning');
            return;
        }

        if (!resultText) {
            this.showNotification('请输入成交结果内容', 'warning');
            return;
        }

        this.setButtonLoading(this.elements.manualConversionFeedback, true);

        try {
            let conversionResult;
            try {
                conversionResult = JSON.parse(resultText);
            } catch (e) {
                throw new Error('成交结果格式错误，请输入有效的JSON格式');
            }

            const result = await this.apiClient.submitConversionFeedback(sessionId, conversionResult);

            this.addTestResult({
                name: '手动成交反馈',
                type: 'manual_conversion_feedback',
                success: true,
                result: result,
                timestamp: new Date().toISOString()
            });

            this.showNotification('成交反馈提交成功', 'success');
        } catch (error) {
            this.addTestResult({
                name: '手动成交反馈',
                type: 'manual_conversion_feedback',
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            this.showNotification(`成交反馈失败: ${error.message}`, 'error');
        } finally {
            this.setButtonLoading(this.elements.manualConversionFeedback, false);
            this.updateStatistics();
        }
    }

    // ==================== 数据管理 ====================

    /**
     * 加载示例数据
     */
    loadSampleData() {
        // 加载示例对话内容
        const sampleData = [
            {
                conversation: '我想买一辆省油的车，预算8万左右，主要考虑燃油经济性和保养成本',
                notes: '客户关注性价比，询问了油耗和保养费用',
                stage: '需求挖掘'
            },
            {
                conversation: '我比较关注车的配置和安全性能，希望有比较好的舒适性配置',
                notes: '客户询问了安全配置和舒适性功能',
                stage: '产品介绍'
            },
            {
                conversation: '这款车的外观设计怎么样？颜值很重要，要有个性一点的',
                notes: '年轻客户，很关注外观设计和个性化',
                stage: '产品介绍'
            }
        ];

        const randomSample = sampleData[Math.floor(Math.random() * sampleData.length)];
        
        this.elements.conversationText.value = randomSample.conversation;
        this.elements.advisorNotes.value = randomSample.notes;
        this.elements.customerStage.value = randomSample.stage;

        this.showNotification('示例数据已加载', 'info');
    }

    /**
     * 清空测试数据
     */
    clearTestData() {
        this.elements.conversationText.value = '';
        this.elements.advisorNotes.value = '';
        this.elements.customerStage.value = '需求挖掘';
        this.elements.sessionId.value = '';
        this.elements.materialFeedback.value = '';
        this.elements.conversionResult.value = '';

        this.showNotification('测试数据已清空', 'info');
    }

    /**
     * 上传测试数据
     */
    uploadTestData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.conversation_text) {
                    this.elements.conversationText.value = data.conversation_text;
                }
                if (data.advisor_notes) {
                    this.elements.advisorNotes.value = data.advisor_notes;
                }
                if (data.customer_stage) {
                    this.elements.customerStage.value = data.customer_stage;
                }

                this.showNotification('测试数据上传成功', 'success');
            } catch (error) {
                this.showNotification('文件格式错误，请上传有效的JSON文件', 'error');
            }
        };

        reader.readAsText(file);
    }

    // ==================== 结果管理 ====================

    /**
     * 添加测试结果
     */
    addTestResult(result) {
        const resultElement = this.createTestResultElement(result);
        this.elements.testResults.insertBefore(resultElement, this.elements.testResults.firstChild);
    }

    /**
     * 更新测试结果
     */
    updateTestResult(result) {
        // 查找对应的结果元素并更新
        const existingElement = this.elements.testResults.querySelector(`[data-test-name="${result.name}"]`);
        if (existingElement) {
            const newElement = this.createTestResultElement(result);
            existingElement.replaceWith(newElement);
        } else {
            this.addTestResult(result);
        }
    }

    /**
     * 创建测试结果元素
     */
    createTestResultElement(result) {
        const div = document.createElement('div');
        div.className = `test-result-item ${result.success ? 'success' : result.success === false ? 'error' : ''}`;
        div.setAttribute('data-test-name', result.name);

        const statusClass = result.status === 'running' ? 'running' : 
                           result.success ? 'success' : 'error';
        const statusText = result.status === 'running' ? '运行中' : 
                          result.success ? '通过' : '失败';

        div.innerHTML = `
            <div class="test-result-header">
                <div class="test-result-title">${result.name}</div>
                <div class="test-result-status ${statusClass}">${statusText}</div>
            </div>
            <div class="test-result-details">
                ${result.description || ''}
                ${result.responseTime ? ` | 响应时间: ${result.responseTime}ms` : ''}
                ${result.timestamp ? ` | 时间: ${new Date(result.timestamp).toLocaleString()}` : ''}
            </div>
            ${result.error ? `<div class="test-result-data" style="color: red;">错误: ${result.error}</div>` : ''}
            ${result.result ? `<div class="test-result-data">${JSON.stringify(result.result, null, 2)}</div>` : ''}
        `;

        return div;
    }

    /**
     * 清空结果
     */
    clearResults() {
        this.elements.testResults.innerHTML = '';
        this.testRunner.clearResults();
        this.updateStatistics();
        this.showNotification('测试结果已清空', 'info');
    }

    /**
     * 导出结果
     */
    exportResults() {
        try {
            const report = this.testRunner.generateTestReport();
            const jsonData = JSON.stringify(report, null, 2);
            
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai-marketing-test-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            this.showNotification('测试报告已导出', 'success');
        } catch (error) {
            this.showNotification(`导出失败: ${error.message}`, 'error');
        }
    }

    // ==================== 统计更新 ====================

    /**
     * 更新统计信息
     */
    updateStatistics() {
        const report = this.testRunner.generateTestReport();
        
        this.elements.totalTests.textContent = report.summary.total;
        this.elements.passedTests.textContent = report.summary.passed;
        this.elements.failedTests.textContent = report.summary.failed;
        this.elements.avgResponseTime.textContent = `${report.summary.averageResponseTime}ms`;
    }

    /**
     * 更新进度
     */
    updateProgress(current, total) {
        const percentage = total > 0 ? (current / total) * 100 : 0;
        this.elements.progressFill.style.width = `${percentage}%`;
        this.elements.progressText.textContent = `${current}/${total}`;
    }

    // ==================== UI辅助方法 ====================

    /**
     * 设置按钮加载状态
     */
    setButtonLoading(button, loading) {
        if (loading) {
            button.disabled = true;
            button.classList.add('loading');
            const icon = button.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-spinner fa-spin';
            }
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            const icon = button.querySelector('i');
            if (icon) {
                // 恢复原始图标（这里简化处理）
                icon.className = icon.className.replace('fa-spinner fa-spin', 'fa-play-circle');
            }
        }
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            animation: slideIn 0.3s ease-out;
        `;

        // 设置背景色
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        notification.textContent = message;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    /**
     * 切换手动测试区域
     */
    toggleManualTest() {
        const content = this.elements.manualTestContent;
        const button = this.elements.toggleManualTest;
        const icon = button.querySelector('i');

        if (content.style.display === 'none') {
            content.style.display = 'block';
            icon.className = 'fas fa-chevron-up';
        } else {
            content.style.display = 'none';
            icon.className = 'fas fa-chevron-down';
        }
    }

    /**
     * 显示日志
     */
    async showLogs() {
        try {
            const logs = await this.apiClient.getSystemLogs(50);
            this.showModal('系统日志', `<pre>${JSON.stringify(logs, null, 2)}</pre>`);
        } catch (error) {
            this.showNotification(`获取日志失败: ${error.message}`, 'error');
        }
    }

    /**
     * 显示帮助
     */
    showHelp() {
        const helpContent = `
            <h3>使用说明</h3>
            <h4>1. API连接</h4>
            <p>首先配置API地址和认证信息，点击"连接API"按钮建立连接。</p>
            
            <h4>2. 自动化测试</h4>
            <ul>
                <li><strong>一键运行所有测试</strong>: 执行完整的测试套件</li>
                <li><strong>基础功能测试</strong>: 测试健康检查、认证等基础功能</li>
                <li><strong>业务逻辑测试</strong>: 测试客户分析、物料推荐等业务功能</li>
                <li><strong>性能测试</strong>: 测试并发性能和响应时间</li>
            </ul>
            
            <h4>3. 手动测试</h4>
            <p>可以手动输入测试数据，验证特定场景下的API行为。</p>
            
            <h4>4. 测试数据</h4>
            <p>支持加载示例数据、上传自定义测试数据文件。</p>
            
            <h4>5. 结果查看</h4>
            <p>测试结果实时显示，支持导出为JSON格式的测试报告。</p>
        `;
        
        this.showModal('帮助文档', helpContent);
    }

    /**
     * 显示模态框
     */
    showModal(title, content) {
        this.elements.modalTitle.textContent = title;
        this.elements.modalBody.innerHTML = content;
        this.elements.modal.style.display = 'block';
    }

    /**
     * 关闭模态框
     */
    closeModal() {
        this.elements.modal.style.display = 'none';
    }
}

