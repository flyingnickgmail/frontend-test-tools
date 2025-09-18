"""
测试数据管理器 - 负责加载和管理测试用例数据
"""
import pandas as pd
import json
from pathlib import Path
from typing import List, Dict, Any
import logging

class TestDataManager:
    def __init__(self, base_path: str = None):
        self.base_path = Path(base_path) if base_path else Path(__file__).parent.parent
        self.test_cases_dir = self.base_path / "test_cases"
        self.logger = logging.getLogger(__name__)
    
    def load_regression_cases(self) -> List[Dict[str, Any]]:
        """加载回归测试用例"""
        try:
            csv_path = self.test_cases_dir / "regression_suite.csv"
            if not csv_path.exists():
                self.logger.warning(f"回归测试文件不存在: {csv_path}")
                return []
            
            df = pd.read_csv(csv_path)
            
            # 转换为测试用例字典列表
            test_cases = []
            for _, row in df.iterrows():
                test_case = {
                    'test_id': row['test_id'],
                    'question': row['question'],
                    'expected_keywords': self._parse_keywords(row['expected_keywords']),
                    'forbidden_keywords': self._parse_keywords(row['forbidden_keywords']),
                    'check_source': row['check_source'],
                    'priority': row['priority'],
                    'timeout': row.get('timeout', 30)
                }
                test_cases.append(test_case)
            
            self.logger.info(f"加载了 {len(test_cases)} 个回归测试用例")
            return test_cases
            
        except Exception as e:
            self.logger.error(f"加载回归测试用例失败: {e}")
            return []
    
    def load_incremental_cases(self) -> List[Dict[str, Any]]:
        """加载增量测试用例"""
        try:
            json_path = self.test_cases_dir / "incremental_cases.json"
            if not json_path.exists():
                self.logger.info("增量测试文件不存在，返回空列表")
                return []
            
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            test_cases = data.get('test_cases', [])
            self.logger.info(f"加载了 {len(test_cases)} 个增量测试用例")
            return test_cases
            
        except Exception as e:
            self.logger.error(f"加载增量测试用例失败: {e}")
            return []
    
    def _parse_keywords(self, keywords_str: str) -> List[str]:
        """解析关键词字符串"""
        if pd.isna(keywords_str) or not keywords_str:
            return []
        
        # 按逗号分割并清理空白
        keywords = [kw.strip() for kw in str(keywords_str).split(',')]
        return [kw for kw in keywords if kw]
    
    def save_incremental_cases(self, test_cases: List[Dict[str, Any]]):
        """保存增量测试用例"""
        try:
            json_path = self.test_cases_dir / "incremental_cases.json"
            data = {
                'generated_at': pd.Timestamp.now().isoformat(),
                'test_cases': test_cases
            }
            
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            self.logger.info(f"保存了 {len(test_cases)} 个增量测试用例")
            
        except Exception as e:
            self.logger.error(f"保存增量测试用例失败: {e}")
    
    def get_test_cases_by_priority(self, priority: str = None) -> List[Dict[str, Any]]:
        """根据优先级获取测试用例"""
        all_cases = self.load_regression_cases() + self.load_incremental_cases()
        
        if priority:
            filtered_cases = [case for case in all_cases 
                            if str(case.get('priority', '')).upper() == priority.upper()]
            return filtered_cases
        
        return all_cases
    
    def get_high_priority_cases(self) -> List[Dict[str, Any]]:
        """获取高优先级测试用例"""
        return self.get_test_cases_by_priority('HIGH')
    
    def validate_test_case(self, test_case: Dict[str, Any]) -> bool:
        """验证测试用例格式"""
        required_fields = ['test_id', 'question', 'expected_keywords']
        
        for field in required_fields:
            if field not in test_case:
                self.logger.error(f"测试用例缺少必需字段: {field}")
                return False
        
        return True

# 用于pytest参数化的便捷函数
def get_regression_test_params():
    """获取回归测试的pytest参数"""
    manager = TestDataManager()
    test_cases = manager.load_regression_cases()
    
    # 返回pytest.mark.parametrize需要的格式
    params = []
    for case in test_cases:
        params.append((
            case['test_id'],
            case['question'], 
            case['expected_keywords'],
            case['forbidden_keywords'],
            case['check_source'],
            case['priority'],
            case['timeout']
        ))
    
    return params

def get_high_priority_test_params():
    """获取高优先级测试的pytest参数"""
    manager = TestDataManager()
    test_cases = manager.get_high_priority_cases()
    
    params = []
    for case in test_cases:
        params.append((
            case['test_id'],
            case['question'], 
            case['expected_keywords'],
            case['forbidden_keywords'],
            case['check_source'],
            case['priority'],
            case['timeout']
        ))
    
    return params
