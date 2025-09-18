/**
 * 主应用入口
 */
class App {
    constructor() {
        this.apiClient = null;
        this.testRunner = null;
        this.uiController = null;
        
        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    /**
     * 初始化应用组件
     */
    initializeApp() {
        try {
            // 初始化API客户端
            this.apiClient = new AIMarketingAPIClient();
            
            // 初始化测试运行器
            this.testRunner = new TestRunner(this.apiClient);
            
            // 初始化UI控制器
            this.uiController = new UIController(this.apiClient, this.testRunner);
            
            // 设置默认配置
            this.setDefaultConfiguration();
            
            // 添加全局错误处理
            this.setupGlobalErrorHandling();
            
            // 添加键盘快捷键
            this.setupKeyboardShortcuts();
            
            console.log('AI营销助手测试平台初始化完成');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showCriticalError('应用初始化失败，请刷新页面重试');
        }
    }

    /**
     * 设置默认配置
     */
    setDefaultConfiguration() {
        // 设置默认API配置
        const apiBaseUrlElement = document.getElementById('api-base-url');
        const apiKeyElement = document.getElementById('api-key');
        const apiSecretElement = document.getElementById('api-secret');

        if (apiBaseUrlElement && !apiBaseUrlElement.value) {
            apiBaseUrlElement.value = 'http://localhost:8003';
        }

        if (apiKeyElement && !apiKeyElement.value) {
            apiKeyElement.value = 'demo_api_key';
        }

        if (apiSecretElement && !apiSecretElement.value) {
            apiSecretElement.value = 'demo_secret';
        }

        // 设置默认手动测试数据
        this.setDefaultTestData();
    }

    /**
     * 设置默认测试数据
     */
    setDefaultTestData() {
        const materialFeedbackElement = document.getElementById('material-feedback');
        const conversionResultElement = document.getElementById('conversion-result');

        if (materialFeedbackElement && !materialFeedbackElement.value) {
            materialFeedbackElement.value = JSON.stringify([
                {
                    "material_id": "MAT_001",
                    "usage_status": "已使用",
                    "customer_reaction": "积极",
                    "effectiveness": "高",
                    "notes": "客户对燃油经济性数据很感兴趣"
                }
            ], null, 2);
        }

        if (conversionResultElement && !conversionResultElement.value) {
            conversionResultElement.value = JSON.stringify({
                "success": true,
                "deal_amount": 78000,
                "deal_date": new Date().toISOString().split('T')[0],
                "vehicle_model": "伊兰特",
                "configuration": "1.5L CVT智联版",
                "notes": "客户对燃油经济性很满意，最终选择了智联版"
            }, null, 2);
        }
    }

    /**
     * 设置全局错误处理
     */
    setupGlobalErrorHandling() {
        // 捕获未处理的Promise错误
        window.addEventListener('unhandledrejection', (event) => {
            console.error('未处理的Promise错误:', event.reason);
            this.showError(`系统错误: ${event.reason.message || event.reason}`);
            event.preventDefault();
        });

        // 捕获JavaScript错误
        window.addEventListener('error', (event) => {
            console.error('JavaScript错误:', event.error);
            this.showError(`脚本错误: ${event.error.message}`);
        });

        // 捕获资源加载错误
        window.addEventListener('error', (event) => {
            if (event.target !== window) {
                console.error('资源加载错误:', event.target.src || event.target.href);
            }
        }, true);
    }

    /**
     * 设置键盘快捷键
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + Enter: 运行所有测试
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                const runAllButton = document.getElementById('run-all-tests');
                if (runAllButton && !runAllButton.disabled) {
                    runAllButton.click();
                }
            }

            // Ctrl/Cmd + R: 清空结果
            if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
                event.preventDefault();
                const clearButton = document.getElementById('clear-results');
                if (clearButton) {
                    clearButton.click();
                }
            }

            // Ctrl/Cmd + S: 导出结果
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                const exportButton = document.getElementById('export-results');
                if (exportButton) {
                    exportButton.click();
                }
            }

            // F1: 显示帮助
            if (event.key === 'F1') {
                event.preventDefault();
                const helpButton = document.getElementById('show-help');
                if (helpButton) {
                    helpButton.click();
                }
            }

            // Escape: 关闭模态框
            if (event.key === 'Escape') {
                const modal = document.getElementById('modal');
                if (modal && modal.style.display === 'block') {
                    const closeButton = document.getElementById('modal-close');
                    if (closeButton) {
                        closeButton.click();
                    }
                }
            }
        });
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        if (this.uiController) {
            this.uiController.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * 显示严重错误
     */
    showCriticalError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            font-size: 18px;
            text-align: center;
        `;
        
        errorDiv.innerHTML = `
            <div>
                <h2>系统错误</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 20px;
                ">刷新页面</button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }

    /**
     * 获取应用状态
     */
    getAppStatus() {
        return {
            apiClient: !!this.apiClient,
            testRunner: !!this.testRunner,
            uiController: !!this.uiController,
            apiConnected: this.apiClient ? !!this.apiClient.accessToken : false,
            testRunning: this.testRunner ? this.testRunner.isRunning : false
        };
    }

    /**
     * 重置应用状态
     */
    resetApp() {
        if (this.testRunner) {
            this.testRunner.clearResults();
        }
        
        if (this.apiClient) {
            this.apiClient.resetMetrics();
        }
        
        if (this.uiController) {
            this.uiController.clearResults();
            this.uiController.showNotification('应用状态已重置', 'info');
        }
    }

    /**
     * 导出应用配置
     */
    exportConfiguration() {
        const config = {
            apiBaseUrl: document.getElementById('api-base-url')?.value || '',
            apiKey: document.getElementById('api-key')?.value || '',
            // 注意：不导出密钥以保护安全
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `ai-marketing-test-config-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        if (this.uiController) {
            this.uiController.showNotification('配置已导出', 'success');
        }
    }

    /**
     * 导入应用配置
     */
    importConfiguration(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                
                if (config.apiBaseUrl) {
                    const element = document.getElementById('api-base-url');
                    if (element) element.value = config.apiBaseUrl;
                }
                
                if (config.apiKey) {
                    const element = document.getElementById('api-key');
                    if (element) element.value = config.apiKey;
                }
                
                if (this.uiController) {
                    this.uiController.showNotification('配置已导入', 'success');
                }
            } catch (error) {
                if (this.uiController) {
                    this.uiController.showNotification('配置文件格式错误', 'error');
                }
            }
        };
        
        reader.readAsText(file);
    }
}

// 创建全局应用实例
let app;

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app = new App();
    
    // 将应用实例暴露到全局作用域，便于调试
    window.aiMarketingTestApp = app;
    
    // 添加一些调试方法
    window.debugApp = {
        getStatus: () => app.getAppStatus(),
        resetApp: () => app.resetApp(),
        exportConfig: () => app.exportConfiguration(),
        getApiMetrics: () => app.apiClient ? app.apiClient.getMetrics() : null,
        getTestResults: () => app.testRunner ? app.testRunner.generateTestReport() : null
    };
    
    console.log('AI营销助手测试平台已启动');
    console.log('调试命令: window.debugApp');
});

// 添加CSS动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .loading {
        opacity: 0.7;
        cursor: not-allowed !important;
    }
    
    .notification {
        animation: slideIn 0.3s ease-out;
    }
`;
document.head.appendChild(style);

