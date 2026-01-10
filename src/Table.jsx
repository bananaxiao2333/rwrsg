import { useState, useMemo } from "react";
import {
  Table,
  Input,
  Row,
  Col,
  Card,
  Descriptions,
  Button,
  Modal,
  InputNumber,
  Image,
  Statistic,
  Divider,
  Tabs,
} from "antd";
import {
  SearchOutlined,
  SwapOutlined,
  PlusOutlined,
  DollarCircleOutlined,
  PieChartOutlined,
  BarChartOutlined,
  RadarChartOutlined,
} from "@ant-design/icons";
import { Pie, Column, Radar } from "@ant-design/plots";
import DataSource from "./data.json";
import KeyListTrans from "../pre-pull/keyListTrans.json";
import priceData from "./price.json";
import useLocalStorageState from "use-local-storage-state";

// 图片预加载
const imageModules = import.meta.glob("./assets/items/*.png", { eager: true });
const preloadedUrls = Object.fromEntries(
  Object.entries(imageModules).map(([path, module]) => [path, module.default])
);

// 获取 App.jsx 中的 data 状态
const getInventoryData = () => {
  const stored = localStorage.getItem("data");
  return stored ? JSON.parse(stored) : [
    { key: "lottery", name: "彩票", price: 1700, num: 1 },
    { key: "vest3", name: "Ⅲ型防弹背心", price: 200, num: 2 },
    { key: "aug", name: "斯太尔AUG突击步枪", price: 250, num: 5 },
  ];
};

const setInventoryData = (newData) => {
  const existing = getInventoryData();
  const merged = [...existing, ...newData];
  localStorage.setItem("data", JSON.stringify(merged));
};

// 姿态翻译映射
const stanceTranslations = {
  running: "奔跑",
  walking: "行走",
  crouch_moving: "蹲伏移动",
  standing: "站立",
  crouching: "蹲伏",
  prone: "匍匐",
  prone_moving: "匍匐移动",
  over_wall: "越墙"
};

// 转换数据格式：将data.json的字典结构转换为数组
const convertDataToArray = (data) => {
  return Object.entries(data).map(([id, weapon]) => {
    const converted = {
      id: id,  // 保存外层键（如 "ar15"）
      enName: weapon.en_name,
      cnName: weapon.cn_name,
      key: weapon.key,  // 内部的key字段（如 "ar15.weapon"）
      type: weapon.type,
      ...weapon.spec,
    };
    return converted;
  });
};

const WeaponList = convertDataToArray(DataSource);

const RwrTable = () => {
  // 使用localStorage存储表格设置
  const [tableSettings, setTableSettings] = useLocalStorageState(
    "weaponTableSettings",
    {
      defaultValue: {
        pageSize: 10,
        searchText: "",
        sortColumn: "cnName",
        sortDirection: "ascend",
      },
    }
  );

  // 状态管理
  const [searchText, setSearchText] = useState(tableSettings.searchText);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [editPrice, setEditPrice] = useState(null);
  const [editNum, setEditNum] = useState(null);

  // 处理搜索
  const handleSearch = (value) => {
    setSearchText(value);
    setTableSettings({ ...tableSettings, searchText: value });
  };

  // 打开编辑对话框
  const handleOpenEdit = (record) => {
    setEditRecord(record);
    setEditPrice(record.price || priceData[record.id] || null);
    setEditNum(record.num || 1);
    setEditModalVisible(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    const newData = [{
      key: editRecord.id,  // 使用外层键（如 "ar15"）
      name: editRecord.cnName,
      price: editPrice,
      num: editNum,
    }];
    setInventoryData(newData);
    setEditModalVisible(false);
    setEditRecord(null);
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
        const enName = weapon.enName?.toLowerCase() || "";
        return (
          cnName.includes(searchText.toLowerCase()) ||
          enName.includes(searchText.toLowerCase())
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
    return [
      {
        title: "图片",
        dataIndex: "id",
        key: "image",
        fixed: "left",
        width: 80,
        sorter: true,
        sortOrder:
          tableSettings.sortColumn === "id"
            ? tableSettings.sortDirection
            : null,
        render: (id, record) => (
          <img
            src={preloadedUrls["./assets/items/" + id + ".png"]}
            fallback="data:image/png;base64,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"
            style={{
              maxHeight: "50px",
              maxWidth: "50px",
              objectFit: "contain",
            }}
          />
        ),
      },
      {
        title: "中文名称",
        dataIndex: "cnName",
        key: "cnName",
        fixed: "left",
        width: 200,
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
      },
      {
        title: "键",
        dataIndex: "id",
        key: "id",
        width: 200,
        sorter: true,
        sortOrder:
          tableSettings.sortColumn === "id"
            ? tableSettings.sortDirection
            : null,
      },
      {
        title: "操作",
        key: "action",
        width: 150,
        render: (_, record) => (
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleOpenEdit(record)}
          >
            添加/编辑
          </Button>
        ),
      },
    ];
  }, [
    tableSettings.sortColumn,
    tableSettings.sortDirection,
  ]);

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
        {Object.entries(selectedWeapon).map(([key, value]) => {
          // 特殊处理姿态属性
          if (key === 'stance' && typeof value === 'object' && value !== null) {
            return (
              <Descriptions.Item
                key={key}
                label={KeyListTrans[key] || key}
                labelStyle={{ fontWeight: "bold", width: "30%" }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(value).map(([stanceKey, stanceValue]) => (
                    <div key={stanceKey}>
                      {stanceTranslations[stanceKey] || stanceKey}: {stanceValue}
                    </div>
                  ))}
                </div>
              </Descriptions.Item>
            );
          }

          // 普通属性直接显示
          return (
            <Descriptions.Item
              key={key}
              label={KeyListTrans[key] || key}
              labelStyle={{ fontWeight: "bold", width: "30%" }}
            >
              {typeof value === "object" ? JSON.stringify(value) : value}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </Card>
  );



  return (
    <div style={{ padding: 20 }}>
      {/* 编辑对话框 */}
      <Modal
        title="添加/编辑物品"
        open={editModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setEditModalVisible(false)}
        width={400}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="物品名称">
            {editRecord?.cnName}
          </Descriptions.Item>
          <Descriptions.Item label="物品键">
            {editRecord?.id}
          </Descriptions.Item>
          <Descriptions.Item label="价格 (rp)">
            <InputNumber
              style={{ width: "100%" }}
              value={editPrice}
              onChange={setEditPrice}
              min={0}
              placeholder={priceData[editRecord?.id] || "输入价格"}
            />
          </Descriptions.Item>
          <Descriptions.Item label="数量">
            <InputNumber
              style={{ width: "100%" }}
              value={editNum}
              onChange={setEditNum}
              min={1}
            />
          </Descriptions.Item>
        </Descriptions>
      </Modal>

      {/* 顶部控制栏 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col flex="auto">
          <Input
            placeholder="搜索武器名称..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            allowClear
            style={{ width: "100%" }}
          />
        </Col>
      </Row>

      {/* 武器表格 */}
      <Table
        dataSource={filteredWeapons}
        columns={columns}
        rowKey="id"
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
    </div>
  );
};

export default RwrTable;
