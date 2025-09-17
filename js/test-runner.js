/**
 * 测试运行器
 */
class TestRunner {
    constructor(apiClient) {
        this.apiClient = apiClient;
        this.testResults = [];
        this.isRunning = false;
        this.currentTest = null;
        this.testSuites = this.initializeTestSuites();
    }

    /**
     * 初始化测试套件
     */
    initializeTestSuites() {
        return {
            basic: {
                name: '基础功能测试',
                tests: [
                    {
                        name: '健康检查',
                        type: 'health',
                        description: '检查API服务是否正常运行',
                        data: {}
                    },
                    {
                        name: '认证测试',
                        type: 'auth',
                        description: '测试API认证功能',
                        data: {}
                    },
                    {
                        name: '物料列表获取',
                        type: 'materials',
                        description: '测试获取物料列表功能',
                        data: {
                            filters: {}
                        }
                    }
                ]
            },
            business: {
                name: '业务逻辑测试',
                tests: [
                    {
                        name: '理性经济型客户分析',
                        type: 'analyze',
                        description: '测试理性经济型客户画像识别',
                        data: {
                            conversation_text: '我想买一辆省油的车，预算8万左右，主要考虑燃油经济性和保养成本',
                            advisor_notes: '客户关注性价比，询问了油耗和保养费用',
                            customer_stage: '需求挖掘',
                            context: {
                                customer_id: 'TEST_C001',
                                advisor_id: 'TEST_A001'
                            }
                        },
                        expectedResults: {
                            persona_type: '理性经济型',
                            confidence: 0.8
                        }
                    },
                    {
                        name: '品质升级型客户分析',
                        type: 'analyze',
                        description: '测试品质升级型客户画像识别',
                        data: {
                            conversation_text: '我比较关注车的配置和安全性能，希望有比较好的舒适性配置',
                            advisor_notes: '客户询问了安全配置和舒适性功能',
                            customer_stage: '产品介绍',
                            context: {
                                customer_id: 'TEST_C002',
                                advisor_id: 'TEST_A001'
                            }
                        },
                        expectedResults: {
                            persona_type: '品质升级型',
                            confidence: 0.8
                        }
                    },
                    {
                        name: '年轻个性型客户分析',
                        type: 'analyze',
                        description: '测试年轻个性型客户画像识别',
                        data: {
                            conversation_text: '这款车的外观设计怎么样？颜值很重要，要有个性一点的',
                            advisor_notes: '年轻客户，很关注外观设计和个性化',
                            customer_stage: '产品介绍',
                            context: {
                                customer_id: 'TEST_C003',
                                advisor_id: 'TEST_A001'
                            }
                        },
                        expectedResults: {
                            persona_type: '年轻个性型',
                            confidence: 0.7
                        }
                    },
                    {
                        name: '物料反馈测试',
                        type: 'material_feedback',
                        description: '测试物料使用反馈功能',
                        data: {
                            session_id: 'TEST_SESSION_001',
                            material_feedback: [
                                {
                                    material_id: 'MAT_001',
                                    usage_status: '已使用',
                                    customer_reaction: '积极',
                                    effectiveness: '高',
                                    notes: '客户对燃油经济性数据很感兴趣'
                                }
                            ]
                        }
                    },
                    {
                        name: '成交反馈测试',
                        type: 'conversion_feedback',
                        description: '测试成交结果反馈功能',
                        data: {
                            session_id: 'TEST_SESSION_001',
                            conversion_result: {
                                success: true,
                                deal_amount: 78000,
                                deal_date: new Date().toISOString().split('T')[0],
                                vehicle_model: '伊兰特',
                                configuration: '1.5L CVT智联版',
                                notes: '客户对燃油经济性很满意，最终选择了智联版'
                            }
                        }
                    }
                ]
            },
            performance: {
                name: '性能测试',
                tests: [
                    {
                        name: '并发客户分析测试',
                        type: 'performance',
                        description: '测试并发客户分析性能',
                        data: {
                            endpoint: '/api/v1/analyze/customer',
                            method: 'POST',
                            payload: {
                                conversation_text: '我想了解一下这款车的性价比如何',
                                advisor_notes: '客户初步咨询',
                                customer_stage: '需求挖掘'
                            },
                            concurrency: 5,
                            iterations: 10
                        }
                    },
                    {
                        name: '物料获取性能测试',
                        type: 'performance',
                        description: '测试物料获取接口性能',
                        data: {
                            endpoint: '/api/v1/materials',
                            method: 'GET',
                            concurrency: 10,
                            iterations: 20
                        }
                    }
                ]
            }
        };
    }

    /**
     * 运行所有测试
     */
    async runAllTests() {
        this.isRunning = true;
        this.testResults = [];
        
        try {
            // 运行基础功能测试
            await this.runTestSuite('basic');
            
            // 运行业务逻辑测试
            await this.runTestSuite('business');
            
            // 运行性能测试
            await this.runTestSuite('performance');
            
        } catch (error) {
            console.error('测试运行出错:', error);
        } finally {
            this.isRunning = false;
            this.currentTest = null;
        }
        
        return this.generateTestReport();
    }

    /**
     * 运行基础测试
     */
    async runBasicTests() {
        return await this.runTestSuite('basic');
    }

    /**
     * 运行业务测试
     */
    async runBusinessTests() {
        return await this.runTestSuite('business');
    }

    /**
     * 运行性能测试
     */
    async runPerformanceTests() {
        return await this.runTestSuite('performance');
    }

    /**
     * 运行测试套件
     */
    async runTestSuite(suiteName) {
        const suite = this.testSuites[suiteName];
        if (!suite) {
            throw new Error(`未找到测试套件: ${suiteName}`);
        }

        this.isRunning = true;
        const suiteResults = [];

        for (const test of suite.tests) {
            this.currentTest = test;
            
            // 触发测试开始事件
            this.onTestStart(test);
            
            try {
                const result = await this.runSingleTest(test);
                suiteResults.push(result);
                this.testResults.push(result);
                
                // 触发测试完成事件
                this.onTestComplete(result);
                
            } catch (error) {
                const errorResult = {
                    name: test.name,
                    type: test.type,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString(),
                    suite: suiteName
                };
                
                suiteResults.push(errorResult);
                this.testResults.push(errorResult);
                
                // 触发测试失败事件
                this.onTestError(errorResult);
            }
        }

        return suiteResults;
    }

    /**
     * 运行单个测试
     */
    async runSingleTest(test) {
        const startTime = Date.now();
        
        try {
            let result;
            
            switch (test.type) {
                case 'health':
                    result = await this.apiClient.healthCheck();
                    break;
                    
                case 'auth':
                    result = await this.apiClient.authenticate();
                    break;
                    
                case 'analyze':
                    result = await this.apiClient.analyzeCustomer(
                        test.data.conversation_text,
                        test.data.advisor_notes,
                        test.data.customer_stage,
                        test.data.context
                    );
                    break;
                    
                case 'materials':
                    result = await this.apiClient.getMaterials(test.data.filters);
                    break;
                    
                case 'material_feedback':
                    result = await this.apiClient.submitMaterialFeedback(
                        test.data.session_id,
                        test.data.material_feedback
                    );
                    break;
                    
                case 'conversion_feedback':
                    result = await this.apiClient.submitConversionFeedback(
                        test.data.session_id,
                        test.data.conversion_result
                    );
                    break;
                    
                case 'performance':
                    result = await this.apiClient.performanceTest(
                        test.data.endpoint,
                        test.data.payload,
                        test.data.concurrency,
                        test.data.iterations
                    );
                    break;
                    
                default:
                    throw new Error(`未知的测试类型: ${test.type}`);
            }
            
            const responseTime = Date.now() - startTime;
            
            // 验证结果
            const validation = this.validateTestResult(test, result);
            
            return {
                name: test.name,
                type: test.type,
                description: test.description,
                success: validation.success,
                responseTime,
                result,
                validation,
                timestamp: new Date().toISOString()
            };
            
        } catch (error) {
            const responseTime = Date.now() - startTime;
            
            return {
                name: test.name,
                type: test.type,
                description: test.description,
                success: false,
                responseTime,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    /**
     * 验证测试结果
     */
    validateTestResult(test, result) {
        const validation = {
            success: true,
            messages: []
        };

        // 基本成功检查
        if (!result || (result.success === false)) {
            validation.success = false;
            validation.messages.push('API返回失败结果');
            return validation;
        }

        // 特定测试的验证逻辑
        switch (test.type) {
            case 'health':
                if (!result.status || result.status !== 'healthy') {
                    validation.success = false;
                    validation.messages.push('健康检查状态异常');
                }
                break;
                
            case 'auth':
                if (!result.data || !result.data.access_token) {
                    validation.success = false;
                    validation.messages.push('认证未返回访问令牌');
                }
                break;
                
            case 'analyze':
                if (test.expectedResults) {
                    // 检查画像类型
                    if (test.expectedResults.persona_type && 
                        result.data.persona_type !== test.expectedResults.persona_type) {
                        validation.success = false;
                        validation.messages.push(
                            `画像类型不匹配: 期望 ${test.expectedResults.persona_type}, 实际 ${result.data.persona_type}`
                        );
                    }
                    
                    // 检查置信度
                    if (test.expectedResults.confidence && 
                        result.data.confidence < test.expectedResults.confidence) {
                        validation.success = false;
                        validation.messages.push(
                            `置信度过低: 期望 >= ${test.expectedResults.confidence}, 实际 ${result.data.confidence}`
                        );
                    }
                }
                
                // 检查必要字段
                if (!result.data.persona_type || !result.data.recommendations) {
                    validation.success = false;
                    validation.messages.push('分析结果缺少必要字段');
                }
                break;
                
            case 'materials':
                if (!result.data || !Array.isArray(result.data.materials)) {
                    validation.success = false;
                    validation.messages.push('物料列表格式错误');
                }
                break;
                
            case 'performance':
                if (result.successRate < 90) {
                    validation.success = false;
                    validation.messages.push(`性能测试成功率过低: ${result.successRate}%`);
                }
                
                if (result.averageResponseTime > 5000) {
                    validation.success = false;
                    validation.messages.push(`平均响应时间过长: ${result.averageResponseTime}ms`);
                }
                break;
        }

        if (validation.messages.length === 0) {
            validation.messages.push('所有验证通过');
        }

        return validation;
    }

    /**
     * 生成测试报告
     */
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.success).length;
        const failedTests = totalTests - passedTests;
        
        const responseTimes = this.testResults
            .filter(r => r.responseTime)
            .map(r => r.responseTime);
        
        const avgResponseTime = responseTimes.length > 0 
            ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length)
            : 0;

        return {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0,
                averageResponseTime: avgResponseTime,
                executionTime: this.getExecutionTime(),
                timestamp: new Date().toISOString()
            },
            results: this.testResults,
            apiMetrics: this.apiClient.getMetrics()
        };
    }

    /**
     * 获取执行时间
     */
    getExecutionTime() {
        if (this.testResults.length === 0) return 0;
        
        const startTime = new Date(this.testResults[0].timestamp);
        const endTime = new Date(this.testResults[this.testResults.length - 1].timestamp);
        
        return endTime - startTime;
    }

    /**
     * 清空测试结果
     */
    clearResults() {
        this.testResults = [];
        this.apiClient.resetMetrics();
    }

    /**
     * 导出测试结果
     */
    exportResults(format = 'json') {
        const report = this.generateTestReport();
        
        switch (format) {
            case 'json':
                return JSON.stringify(report, null, 2);
                
            case 'csv':
                return this.convertToCSV(report.results);
                
            case 'html':
                return this.convertToHTML(report);
                
            default:
                throw new Error(`不支持的导出格式: ${format}`);
        }
    }

    /**
     * 转换为CSV格式
     */
    convertToCSV(results) {
        const headers = ['测试名称', '类型', '状态', '响应时间(ms)', '错误信息', '时间戳'];
        const rows = results.map(result => [
            result.name,
            result.type,
            result.success ? '通过' : '失败',
            result.responseTime || 0,
            result.error || '',
            result.timestamp
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    /**
     * 转换为HTML格式
     */
    convertToHTML(report) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>AI营销助手API测试报告</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .success { color: green; }
                .error { color: red; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>AI营销助手API测试报告</h1>
            <div class="summary">
                <h2>测试概要</h2>
                <p>总测试数: ${report.summary.total}</p>
                <p>通过: <span class="success">${report.summary.passed}</span></p>
                <p>失败: <span class="error">${report.summary.failed}</span></p>
                <p>成功率: ${report.summary.successRate}%</p>
                <p>平均响应时间: ${report.summary.averageResponseTime}ms</p>
                <p>生成时间: ${report.summary.timestamp}</p>
            </div>
            <h2>详细结果</h2>
            <table>
                <tr>
                    <th>测试名称</th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>响应时间</th>
                    <th>错误信息</th>
                </tr>
                ${report.results.map(result => `
                <tr>
                    <td>${result.name}</td>
                    <td>${result.type}</td>
                    <td class="${result.success ? 'success' : 'error'}">${result.success ? '通过' : '失败'}</td>
                    <td>${result.responseTime || 0}ms</td>
                    <td>${result.error || ''}</td>
                </tr>
                `).join('')}
            </table>
        </body>
        </html>
        `;
    }

    // ==================== 事件回调 ====================

    /**
     * 测试开始回调
     */
    onTestStart(test) {
        // 可以被外部重写
        console.log(`开始测试: ${test.name}`);
    }

    /**
     * 测试完成回调
     */
    onTestComplete(result) {
        // 可以被外部重写
        console.log(`测试完成: ${result.name} - ${result.success ? '通过' : '失败'}`);
    }

    /**
     * 测试错误回调
     */
    onTestError(result) {
        // 可以被外部重写
        console.error(`测试失败: ${result.name} - ${result.error}`);
    }

    /**
     * 进度更新回调
     */
    onProgressUpdate(current, total) {
        // 可以被外部重写
        console.log(`测试进度: ${current}/${total}`);
    }
}

