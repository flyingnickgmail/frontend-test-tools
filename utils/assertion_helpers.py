"""
智能断言助手 - 提供高级的测试断言功能
"""
import re
import logging
from typing import List, Dict, Any, Tuple
from playwright.sync_api import Locator, Page
import time

class AssertionHelper:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def check_keywords(self, response_text: str, expected_keywords: List[str], 
                      forbidden_keywords: List[str] = None) -> Dict[str, Any]:
        """
        智能关键词检查
        
        Args:
            response_text: AI回答文本
            expected_keywords: 期望包含的关键词列表
            forbidden_keywords: 禁止出现的关键词列表
            
        Returns:
            检查结果字典
        """
        results = {
            'passed': True,
            'missing_keywords': [],
            'forbidden_found': [],
            'confidence_score': 0.0,
            'details': []
        }
        
        if not response_text:
            results['passed'] = False
            results['details'].append("回答文本为空")
            return results
        
        response_lower = response_text.lower()
        
        # 检查期望关键词
        total_expected = len(expected_keywords) if expected_keywords else 0
        found_expected = 0
        
        if expected_keywords:
            for keyword in expected_keywords:
                if keyword.lower() in response_lower:
                    found_expected += 1
                    results['details'].append(f"✅ 找到期望关键词: {keyword}")
                else:
                    results['missing_keywords'].append(keyword)
                    results['details'].append(f"❌ 缺少期望关键词: {keyword}")
        
        # 检查禁用关键词
        if forbidden_keywords:
            for keyword in forbidden_keywords:
                if keyword.lower() in response_lower:
                    results['forbidden_found'].append(keyword)
                    results['details'].append(f"⚠️ 发现禁用关键词: {keyword}")
                    results['passed'] = False
        
        # 计算置信度分数
        if total_expected > 0:
            keyword_score = found_expected / total_expected
        else:
            keyword_score = 1.0
        
        # 如果有禁用词被发现，降低置信度
        forbidden_penalty = len(results['forbidden_found']) * 0.2
        results['confidence_score'] = max(0.0, keyword_score - forbidden_penalty)
        
        # 判断是否通过（至少50%的期望关键词 + 无禁用词）
        if total_expected > 0:
            results['passed'] = (found_expected / total_expected >= 0.5) and len(results['forbidden_found']) == 0
        else:
            results['passed'] = len(results['forbidden_found']) == 0
        
        return results
    
    def check_source_citation(self, response_container: Locator) -> Dict[str, Any]:
        """
        验证引用来源
        
        Args:
            response_container: 回答容器的Locator
            
        Returns:
            来源检查结果
        """
        results = {
            'has_source': False,
            'source_count': 0,
            'source_links': [],
            'details': []
        }
        
        try:
            # 查找引用来源链接
            source_links = response_container.locator(".source-link, .citation, .reference")
            source_count = source_links.count()
            
            results['source_count'] = source_count
            results['has_source'] = source_count > 0
            
            if source_count > 0:
                results['details'].append(f"✅ 找到 {source_count} 个引用来源")
                
                # 获取链接文本
                for i in range(min(source_count, 5)):  # 最多检查5个链接
                    try:
                        link_text = source_links.nth(i).inner_text()
                        results['source_links'].append(link_text)
                    except:
                        pass
            else:
                results['details'].append("❌ 未找到引用来源")
                
        except Exception as e:
            results['details'].append(f"检查引用来源时出错: {str(e)}")
            self.logger.error(f"检查引用来源失败: {e}")
        
        return results
    
    def calculate_response_quality(self, response_text: str, 
                                 expected_criteria: Dict[str, Any]) -> Dict[str, Any]:
        """
        计算回答质量分数
        
        Args:
            response_text: AI回答文本
            expected_criteria: 期望标准
            
        Returns:
            质量评估结果
        """
        quality_results = {
            'overall_score': 0.0,
            'length_score': 0.0,
            'completeness_score': 0.0,
            'relevance_score': 0.0,
            'details': []
        }
        
        if not response_text:
            return quality_results
        
        # 长度评分 (合理的回答长度)
        text_length = len(response_text)
        if 50 <= text_length <= 500:
            quality_results['length_score'] = 1.0
        elif 20 <= text_length < 50 or 500 < text_length <= 1000:
            quality_results['length_score'] = 0.7
        else:
            quality_results['length_score'] = 0.3
        
        quality_results['details'].append(f"回答长度: {text_length} 字符，得分: {quality_results['length_score']}")
        
        # 完整性评分 (基于关键词覆盖)
        expected_keywords = expected_criteria.get('expected_keywords', [])
        if expected_keywords:
            keyword_check = self.check_keywords(response_text, expected_keywords)
            quality_results['completeness_score'] = keyword_check['confidence_score']
        else:
            quality_results['completeness_score'] = 0.8  # 默认分数
        
        # 相关性评分 (简单的启发式方法)
        question = expected_criteria.get('question', '')
        if question:
            # 检查回答是否包含问题中的关键词
            question_words = set(re.findall(r'\w+', question.lower()))
            response_words = set(re.findall(r'\w+', response_text.lower()))
            
            if question_words:
                overlap = len(question_words.intersection(response_words))
                quality_results['relevance_score'] = min(1.0, overlap / len(question_words))
            else:
                quality_results['relevance_score'] = 0.5
        else:
            quality_results['relevance_score'] = 0.5
        
        # 计算总分 (加权平均)
        weights = {
            'length_score': 0.2,
            'completeness_score': 0.5,
            'relevance_score': 0.3
        }
        
        quality_results['overall_score'] = sum(
            quality_results[key] * weight 
            for key, weight in weights.items()
        )
        
        quality_results['details'].append(f"总体质量得分: {quality_results['overall_score']:.2f}")
        
        return quality_results
    
    def wait_for_ai_response(self, page: Page, timeout: int = 30) -> Tuple[bool, str]:
        """
        等待AI回答并获取文本
        
        Args:
            page: Playwright页面对象
            timeout: 超时时间（秒）
            
        Returns:
            (是否成功, 回答文本)
        """
        try:
            # 等待回答容器出现
            response_container = page.locator(".ai-response-container, .response-container, .answer-container").last()
            
            # 等待回答文本出现
            response_container.wait_for(state="visible", timeout=timeout * 1000)
            
            # 等待一小段时间确保内容加载完成
            time.sleep(2)
            
            # 获取回答文本
            response_text_locator = response_container.locator(".ai-response-text, .response-text, .answer-text")
            
            if response_text_locator.count() > 0:
                response_text = response_text_locator.inner_text()
                return True, response_text
            else:
                # 如果没有找到特定的文本元素，尝试获取整个容器的文本
                response_text = response_container.inner_text()
                return True, response_text
                
        except Exception as e:
            self.logger.error(f"等待AI回答失败: {e}")
            return False, f"等待回答超时或出错: {str(e)}"
    
    def assert_test_case(self, page: Page, test_case: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行完整的测试用例断言
        
        Args:
            page: Playwright页面对象
            test_case: 测试用例数据
            
        Returns:
            完整的断言结果
        """
        result = {
            'test_id': test_case['test_id'],
            'passed': False,
            'error_message': None,
            'keyword_check': None,
            'source_check': None,
            'quality_check': None,
            'response_text': None,
            'execution_time': 0.0
        }
        
        start_time = time.time()
        
        try:
            # 等待AI回答
            success, response_text = self.wait_for_ai_response(
                page, test_case.get('timeout', 30)
            )
            
            if not success:
                result['error_message'] = response_text
                return result
            
            result['response_text'] = response_text
            
            # 关键词检查
            result['keyword_check'] = self.check_keywords(
                response_text,
                test_case.get('expected_keywords', []),
                test_case.get('forbidden_keywords', [])
            )
            
            # 来源检查（如果需要）
            if test_case.get('check_source', False):
                response_container = page.locator(".ai-response-container, .response-container").last()
                result['source_check'] = self.check_source_citation(response_container)
            
            # 质量检查
            result['quality_check'] = self.calculate_response_quality(
                response_text, test_case
            )
            
            # 判断整体是否通过
            keyword_passed = result['keyword_check']['passed']
            source_passed = True
            
            if test_case.get('check_source', False):
                source_passed = result['source_check']['has_source']
            
            result['passed'] = keyword_passed and source_passed
            
        except Exception as e:
            result['error_message'] = f"断言执行失败: {str(e)}"
            self.logger.error(f"测试用例 {test_case['test_id']} 断言失败: {e}")
        
        finally:
            result['execution_time'] = time.time() - start_time
        
        return result
