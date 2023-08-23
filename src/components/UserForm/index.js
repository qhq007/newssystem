import React, { useState } from 'react'
import { Form, Input, Select } from "antd"

export default function UserForm(props) {
    const { regionList, roleList, form } = props;
    const [isDisable, setIsDisable] = useState(false);

    const { role: { roleType }, roleId, region } = JSON.parse(sessionStorage.getItem("token"));
    // 判断是否禁用选项
    const checkDisable = (value) => {
        if (roleId === 1) {
            return false;
        } else {
            if (value.roleType) {
                return value.roleType <= roleType;
            } else {
                return value !== region;
            }
        }
    }
    return (
        <Form
            form={form}
            layout="vertical"
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisable ? [] : [
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select options={regionList.map(region => ({ value: region, disabled: checkDisable(region) }))} disabled={isDisable} />
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: 'Please input the title of collection!',
                    },
                ]}
            >
                <Select options={roleList.map(role => ({ label: role.roleName, value: role.id, disabled: checkDisable(role) }))} onChange={value => {
                    if (value === 1) {
                        setIsDisable(true);
                        form.setFieldsValue({ region: "" });
                    } else {
                        setIsDisable(false);
                    }
                }} />
            </Form.Item>
        </Form>
    )
}
