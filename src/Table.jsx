import { useState, useMemo } from "react";
import {
  Table,
  Input,
  Button,
  Popover,
  Tag,
  Row,
  Col,
  Card,
  Descriptions,
  Divider,
  Tooltip,
  Select,
  Modal,
  Checkbox,
  Space,
  Collapse,
} from "antd";
import {
  SearchOutlined,
  SettingOutlined,
  SwapOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import WeaponList from "../pre-pull/weaponAttrList.json";
import KeyListTrans from "../pre-pull/keyListTrans.json";
import useLocalStorageState from "use-local-storage-state";

const { Panel } = Collapse;

const RwrTable = () => {
  // 使用localStorage存储表格设置
  const [tableSettings, setTableSettings] = useLocalStorageState(
    "weaponTableSettings",
    {
      defaultValue: {
        visibleColumns: Object.keys(KeyListTrans).slice(0, 8),
        pageSize: 10,
        searchText: "",
        sortColumn: "name",
        sortDirection: "ascend",
      },
    }
  );

  // 状态管理
  const [searchText, setSearchText] = useState(tableSettings.searchText);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [filteredKeys, setFilteredKeys] = useState([]);
  const [selectedWeapons, setSelectedWeapons] = useState([]);
  const [compareModalVisible, setCompareModalVisible] = useState(false);

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
    setTableSettings({ ...tableSettings, searchText: value });
  };

  // 处理列可见性变化
  const handleColumnChange = (selectedKeys) => {
    // 确保名称列始终显示
    const keys = selectedKeys.includes("cnName")
      ? selectedKeys
      : ["cnName", ...selectedKeys];

    const newSettings = { ...tableSettings, visibleColumns: keys };
    setTableSettings(newSettings);
  };

  // 处理分页大小变化
  const handlePageSizeChange = (size) => {
    const newSettings = { ...tableSettings, pageSize: size };
    setTableSettings(newSettings);
  };

  // 处理排序变化
  const handleSortChange = (pagination, filters, sorter) => {
    const newSettings = {
      ...tableSettings,
      sortColumn: sorter.field,
      sortDirection: sorter.order,
    };
    setTableSettings(newSettings);
  };

  // 过滤武器数据
  const filteredWeapons = useMemo(() => {
    let result = [...WeaponList];

    // 应用搜索过滤
    if (searchText) {
      result = result.filter((weapon) => {
        const cnName = weapon.cnName?.toLowerCase() || "";
        const description = weapon.description?.toLowerCase() || "";
        return (
          cnName.includes(searchText.toLowerCase()) ||
          description.includes(searchText.toLowerCase())
        );
      });
    }

    // 应用排序
    const { sortColumn, sortDirection } = tableSettings;
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        // 尝试转换为数字比较
        const numA = parseFloat(aValue);
        const numB = parseFloat(bValue);

        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === "ascend" ? numA - numB : numB - numA;
        }

        // 字符串比较
        const strA = String(aValue || "").toLowerCase();
        const strB = String(bValue || "").toLowerCase();

        return sortDirection === "ascend"
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    return result;
  }, [searchText, tableSettings, WeaponList]);

  // 构建表格列
  const columns = useMemo(() => {
    // 名称列单独处理
    const nameColumn = {
      title: KeyListTrans.cnName || "名称",
      dataIndex: "cnName",
      key: "cnName",
      fixed: "left",
      width: 150,
      sorter: true,
      sortOrder:
        tableSettings.sortColumn === "cnName"
          ? tableSettings.sortDirection
          : null,
      render: (cnName, record) => (
        <Button
          type="link"
          onClick={() => setSelectedWeapon(record)}
          style={{ padding: 0, height: "auto" }}
        >
          {cnName}
        </Button>
      ),
    };

    // 其他列
    const otherColumns = tableSettings.visibleColumns
      .filter((key) => key !== "cnName")
      .map((key) => ({
        title: KeyListTrans[key] || key,
        dataIndex: key,
        key: key,
        sorter: true,
        sortOrder:
          tableSettings.sortColumn === key ? tableSettings.sortDirection : null,
        render: (value) => {
          if (typeof value === "string" && value.length > 20) {
            return (
              <Tooltip title={value}>
                <span>{value.substring(0, 20)}...</span>
              </Tooltip>
            );
          }
          return value;
        },
      }));

    return [nameColumn, ...otherColumns];
  }, [
    tableSettings.visibleColumns,
    tableSettings.sortColumn,
    tableSettings.sortDirection,
  ]);

  const columnSettings = (
    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="选择要显示的列"
        value={tableSettings.visibleColumns.filter((key) => key !== "cnName")}
        onChange={handleColumnChange}
        options={Object.entries(KeyListTrans)
          .filter(([key]) => key !== "cnName")
          .map(([key, value]) => ({
            value: key,
            label: value,
          }))}
      />
      <Divider style={{ margin: "10px 0" }} />
      <div style={{ marginTop: 10 }}>
        <span style={{ marginRight: 8 }}>每页显示:</span>
        <Select
          value={tableSettings.pageSize}
          style={{ width: 80 }}
          onChange={handlePageSizeChange}
          options={[
            { value: 5, label: "5" },
            { value: 10, label: "10" },
            { value: 20, label: "20" },
            { value: 50, label: "50" },
          ]}
        />
      </div>
    </div>
  );

  // 武器详情面板
  const weaponDetailPanel = selectedWeapon && (
    <Card
      title={selectedWeapon.cnName || "未知武器"}
      extra={
        <Button
          type="text"
          icon={<SwapOutlined />}
          onClick={() => setSelectedWeapon(null)}
        />
      }
      style={{ marginTop: 20 }}
    >
      <Descriptions column={2} bordered size="small">
        {Object.entries(selectedWeapon).map(([key, value]) => (
          <Descriptions.Item
            key={key}
            label={KeyListTrans[key] || key}
            labelStyle={{ fontWeight: "bold", width: "30%" }}
          >
            {typeof value === "object" ? JSON.stringify(value) : value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );

  // 枪械对比功能
  const toggleWeaponSelection = (weapon) => {
    const isSelected = selectedWeapons.some((w) => w.cnName === weapon.cnName);

    if (isSelected) {
      setSelectedWeapons(
        selectedWeapons.filter((w) => w.cnName !== weapon.cnName)
      );
    } else {
      setSelectedWeapons([...selectedWeapons, weapon]);
    }
  };

  const compareWeapons = () => {
    if (selectedWeapons.length < 2) return;
    setCompareModalVisible(true);
  };

  // 判断属性性能
  const getPerformanceIndicator = (key, value, values) => {
    // 尝试转换为数字
    const numValue = parseFloat(value);
    const numValues = values.map((v) => parseFloat(v)).filter((v) => !isNaN(v));

    // 如果无法转换为数字，则不显示性能标签
    if (isNaN(numValue) || numValues.length === 0) return null;

    const max = Math.max(...numValues);
    const min = Math.min(...numValues);

    // 判断属性类型，确定优劣方向
    const isHigherBetter = [
      "accuracy_factor",
      "sight_range_modifier",
      "projectile_speed",
      "damage",
      "magazine_size",
    ].includes(key);

    if (numValue === (isHigherBetter ? max : min)) {
      return (
        <Tag color="green" style={{ marginLeft: 5 }}>
          <ArrowUpOutlined /> 最佳
        </Tag>
      );
    } else if (numValue === (isHigherBetter ? min : max)) {
      return (
        <Tag color="red" style={{ marginLeft: 5 }}>
          <ArrowDownOutlined /> 最差
        </Tag>
      );
    }

    return null;
  };

  // 对比表格列
  const compareColumns = [
    {
      title: "属性",
      dataIndex: "key",
      key: "key",
      fixed: "left",
      width: 150,
      render: (key) => KeyListTrans[key] || key,
    },
    ...selectedWeapons.map((weapon) => ({
      title: weapon.cnName,
      dataIndex: weapon.cnName,
      key: weapon.cnName,
      render: (text, record) => {
        const values = Object.values(record).filter((_, k) => k !== "key");
        const indicator = getPerformanceIndicator(record.key, text, values);

        return (
          <div>
            {text}
            {indicator}
          </div>
        );
      },
    })),
  ];

  // 对比数据
  const compareData = useMemo(() => {
    if (selectedWeapons.length === 0) return [];

    // 获取所有武器的所有属性键
    const allKeys = new Set();
    selectedWeapons.forEach((weapon) => {
      Object.keys(weapon).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys).map((key) => ({
      key,
      ...selectedWeapons.reduce((acc, weapon) => {
        acc[weapon.cnName] = weapon[key];
        return acc;
      }, {}),
    }));
  }, [selectedWeapons]);

  return (
    <div style={{ padding: 20 }}>
      {/* 顶部控制栏 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Input
            placeholder="搜索武器名称或描述..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            style={{ width: "100%" }}
          />
        </Col>
        <Col>
          <Popover
            title="表格设置"
            content={columnSettings}
            trigger="click"
            placement="bottomRight"
          >
            <Button icon={<SettingOutlined />}>列设置</Button>
          </Popover>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<SwapOutlined />}
            onClick={compareWeapons}
            disabled={selectedWeapons.length < 2}
          >
            对比武器 ({selectedWeapons.length})
          </Button>
        </Col>
      </Row>

      {/* 武器表格 */}
      <Table
        dataSource={filteredWeapons}
        columns={[
          {
            title: "选择",
            key: "selection",
            fixed: "left",
            width: 60,
            render: (_, record) => (
              <Checkbox
                checked={selectedWeapons.some(
                  (w) => w.cnName === record.cnName
                )}
                onChange={() => toggleWeaponSelection(record)}
              />
            ),
          },
          ...columns,
        ]}
        rowKey="cnName"
        size="small"
        bordered
        scroll={{ x: "max-content", y: "calc(100vh - 220px)" }}
        pagination={{
          pageSize: tableSettings.pageSize,
          showSizeChanger: false,
          showTotal: (total) => `共 ${total} 件武器`,
        }}
        onChange={handleSortChange}
      />

      {/* 武器详情面板 */}
      {weaponDetailPanel}

      {/* 武器对比模态框 */}
      <Modal
        title={`武器对比 (${selectedWeapons.length}件)`}
        open={compareModalVisible}
        width="90%"
        onCancel={() => setCompareModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setCompareModalVisible(false)}>
            关闭
          </Button>,
        ]}
      >
        <Table
          dataSource={compareData}
          columns={compareColumns}
          rowKey="key"
          size="small"
          bordered
          scroll={{ x: "max-content" }}
          pagination={false}
        />

        <Divider />

        <Collapse defaultActiveKey={["differences"]}>
          <Panel header="差异对比" key="differences">
            <Descriptions column={1} bordered size="small">
              {compareData
                .filter((item) => {
                  const values = Object.values(item).slice(1);
                  return new Set(values).size > 1;
                })
                .map((item) => (
                  <Descriptions.Item
                    key={item.key}
                    label={KeyListTrans[item.key] || item.key}
                  >
                    <Space direction="vertical">
                      {selectedWeapons.map((weapon) => {
                        const value = weapon[item.key];
                        const values = selectedWeapons.map((w) => w[item.key]);
                        const indicator = getPerformanceIndicator(
                          item.key,
                          value,
                          values
                        );

                        return (
                          <div key={weapon.cnName}>
                            <Tag color="blue">{weapon.cnName}</Tag>: {value}
                            {indicator}
                          </div>
                        );
                      })}
                    </Space>
                  </Descriptions.Item>
                ))}
            </Descriptions>
          </Panel>
        </Collapse>
      </Modal>
    </div>
  );
};

export default RwrTable;
