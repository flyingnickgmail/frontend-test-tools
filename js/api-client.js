/**
 * AI营销助手API客户端
 */
class AIMarketingAPIClient {
    constructor(baseURL = 'http://localhost:8003') {
        this.baseURL = baseURL;
        this.apiKey = null;
        this.secret = null;
        this.accessToken = null;
        this.tokenExpiry = null;
        this.requestCount = 0;
        this.errorCount = 0;
        this.totalResponseTime = 0;
    }

    /**
     * 设置API凭据
     */
    setCredentials(apiKey, secret) {
        this.apiKey = apiKey;
        this.secret = secret;
    }

    /**
     * 设置基础URL
     */
    setBaseURL(url) {
        this.baseURL = url;
    }

    /**
     * 确保已认证
     */
    async ensureAuthenticated() {
        if (!this.accessToken || new Date() > this.tokenExpiry) {
            await this.authenticate();
        }
    }

    /**
     * 认证获取令牌
     */
    async authenticate() {
        const startTime = Date.now();
        
        try {
            const response = await fetch(`${this.baseURL}/api/v1/auth/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    secret: this.secret
                })
            });

            const responseTime = Date.now() - startTime;
            this.updateMetrics(responseTime, response.ok);

            if (!response.ok) {
                throw new Error(`认证失败: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            
            if (result.success) {
                this.accessToken = result.data.access_token;
                this.tokenExpiry = new Date(Date.now() + result.data.expires_in * 1000);
                return result;
            } else {
                throw new Error(result.error?.message || '认证失败');
            }
        } catch (error) {
            this.updateMetrics(Date.now() - startTime, false);
            throw error;
        }
    }

    /**
     * 通用请求方法
     */
    async makeRequest(endpoint, method = 'GET', data = null, retries = 3) {
        const startTime = Date.now();
        
        for (let i = 0; i < retries; i++) {
            try {
                // 确保已认证（除了认证接口本身）
                if (!endpoint.includes('/auth/token')) {
                    await this.ensureAuthenticated();
                }

                const headers = {
                    'Content-Type': 'application/json',
                };

                // 添加认证头
                if (this.accessToken && !endpoint.includes('/auth/token')) {
                    headers['Authorization'] = `Bearer ${this.accessToken}`;
                }

                const response = await fetch(`${this.baseURL}${endpoint}`, {
                    method,
                    headers,
                    body: data ? JSON.stringify(data) : null
                });

                const responseTime = Date.now() - startTime;
                this.updateMetrics(responseTime, response.ok);

                if (response.ok) {
                    const result = await response.json();
                    return result;
                } else if (response.status === 401 && !endpoint.includes('/auth/token')) {
                    // 令牌过期，重新认证
                    this.accessToken = null;
                    await this.authenticate();
                    continue;
                } else {
                    const errorText = await response.text();
                    throw new Error(`请求失败: ${response.status} ${response.statusText} - ${errorText}`);
                }
            } catch (error) {
                if (i === retries - 1) {
                    this.updateMetrics(Date.now() - startTime, false);
                    throw error;
                }
                // 等待后重试
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
            }
        }
    }

    /**
     * 更新性能指标
     */
    updateMetrics(responseTime, success) {
        this.requestCount++;
        this.totalResponseTime += responseTime;
        if (!success) {
            this.errorCount++;
        }
    }

    /**
     * 获取性能指标
     */
    getMetrics() {
        return {
            requestCount: this.requestCount,
            errorCount: this.errorCount,
            successRate: this.requestCount > 0 ? ((this.requestCount - this.errorCount) / this.requestCount) : 0,
            averageResponseTime: this.requestCount > 0 ? Math.round(this.totalResponseTime / this.requestCount) : 0
        };
    }

    /**
     * 重置指标
     */
    resetMetrics() {
        this.requestCount = 0;
        this.errorCount = 0;
        this.totalResponseTime = 0;
    }

    // ==================== API接口方法 ====================

    /**
     * 健康检查
     */
    async healthCheck() {
        return await this.makeRequest('/api/v1/health');
    }

    /**
     * 客户分析
     */
    async analyzeCustomer(conversationText, advisorNotes = '', customerStage = '需求挖掘', context = {}) {
        const data = {
            conversation_text: conversationText,
            advisor_notes: advisorNotes,
            customer_stage: customerStage,
            context: {
                customer_id: context.customer_id || `C${Date.now()}`,
                advisor_id: context.advisor_id || `A${Date.now()}`,
                timestamp: new Date().toISOString(),
                ...context
            }
        };

        return await this.makeRequest('/api/v1/analyze/customer', 'POST', data);
    }

    /**
     * 获取物料列表
     */
    async getMaterials(filters = {}) {
        const queryParams = new URLSearchParams();
        
        if (filters.persona_type) queryParams.append('persona_type', filters.persona_type);
        if (filters.stage) queryParams.append('stage', filters.stage);
        if (filters.content_type) queryParams.append('content_type', filters.content_type);
        if (filters.limit) queryParams.append('limit', filters.limit);

        const endpoint = `/api/v1/materials${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
        return await this.makeRequest(endpoint);
    }

    /**
     * 获取特定物料详情
     */
    async getMaterial(materialId) {
        return await this.makeRequest(`/api/v1/materials/${materialId}`);
    }

    /**
     * 提交物料反馈
     */
    async submitMaterialFeedback(sessionId, materialFeedback) {
        const data = {
            session_id: sessionId,
            material_feedback: materialFeedback
        };

        return await this.makeRequest('/api/v1/feedback/material', 'POST', data);
    }

    /**
     * 提交成交反馈
     */
    async submitConversionFeedback(sessionId, conversionResult) {
        const data = {
            session_id: sessionId,
            conversion_result: conversionResult
        };

        return await this.makeRequest('/api/v1/feedback/conversion', 'POST', data);
    }

    /**
     * 获取系统统计
     */
    async getSystemStats() {
        return await this.makeRequest('/api/v1/admin/stats');
    }

    /**
     * 获取知识库信息
     */
    async getKnowledgeBase() {
        return await this.makeRequest('/api/v1/admin/knowledge-base');
    }

    /**
     * 触发知识库优化
     */
    async optimizeKnowledgeBase() {
        return await this.makeRequest('/api/v1/admin/optimize', 'POST');
    }

    /**
     * 获取系统日志
     */
    async getSystemLogs(limit = 100) {
        return await this.makeRequest(`/api/v1/admin/logs?limit=${limit}`);
    }

    // ==================== 测试专用方法 ====================

    /**
     * 批量测试接口
     */
    async batchTest(tests) {
        const results = [];
        
        for (const test of tests) {
            try {
                const startTime = Date.now();
                let result;
                
                switch (test.type) {
                    case 'health':
                        result = await this.healthCheck();
                        break;
                    case 'auth':
                        result = await this.authenticate();
                        break;
                    case 'analyze':
                        result = await this.analyzeCustomer(
                            test.data.conversation_text,
                            test.data.advisor_notes,
                            test.data.customer_stage,
                            test.data.context
                        );
                        break;
                    case 'materials':
                        result = await this.getMaterials(test.data.filters);
                        break;
                    case 'material_feedback':
                        result = await this.submitMaterialFeedback(
                            test.data.session_id,
                            test.data.material_feedback
                        );
                        break;
                    case 'conversion_feedback':
                        result = await this.submitConversionFeedback(
                            test.data.session_id,
                            test.data.conversion_result
                        );
                        break;
                    default:
                        throw new Error(`未知的测试类型: ${test.type}`);
                }
                
                const responseTime = Date.now() - startTime;
                
                results.push({
                    name: test.name,
                    type: test.type,
                    success: true,
                    responseTime,
                    result,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                results.push({
                    name: test.name,
                    type: test.type,
                    success: false,
                    error: error.message,
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        return results;
    }

    /**
     * 性能测试
     */
    async performanceTest(endpoint, data = null, concurrency = 5, iterations = 10) {
        const results = [];
        const promises = [];
        
        for (let i = 0; i < concurrency; i++) {
            const promise = (async () => {
                const batchResults = [];
                
                for (let j = 0; j < iterations; j++) {
                    const startTime = Date.now();
                    try {
                        await this.makeRequest(endpoint, data ? 'POST' : 'GET', data);
                        const responseTime = Date.now() - startTime;
                        batchResults.push({
                            success: true,
                            responseTime,
                            timestamp: new Date().toISOString()
                        });
                    } catch (error) {
                        batchResults.push({
                            success: false,
                            error: error.message,
                            responseTime: Date.now() - startTime,
                            timestamp: new Date().toISOString()
                        });
                    }
                }
                
                return batchResults;
            })();
            
            promises.push(promise);
        }
        
        const allResults = await Promise.all(promises);
        
        // 合并所有结果
        for (const batchResults of allResults) {
            results.push(...batchResults);
        }
        
        // 计算统计信息
        const successfulResults = results.filter(r => r.success);
        const failedResults = results.filter(r => !r.success);
        
        return {
            total: results.length,
            successful: successfulResults.length,
            failed: failedResults.length,
            successRate: (successfulResults.length / results.length) * 100,
            averageResponseTime: successfulResults.length > 0 
                ? successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length 
                : 0,
            minResponseTime: successfulResults.length > 0 
                ? Math.min(...successfulResults.map(r => r.responseTime)) 
                : 0,
            maxResponseTime: successfulResults.length > 0 
                ? Math.max(...successfulResults.map(r => r.responseTime)) 
                : 0,
            results
        };
    }
}

