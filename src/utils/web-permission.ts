import axios from "axios";

const BASE = "/web_permission";

export type PermType = "screen" | "action";
export type GrantType = "user" | "department";

export interface WebPermissionGrant {
  id?: number;
  permCode: string;
  grantType: GrantType;
  grantValue: string;
  createdDate?: string;
  createdBy?: string;
}

export interface WebPermission {
  permCode: string;
  permType: PermType;
  name: string;
  category?: string | null;
  description?: string | null;
  orderIdx: number;
  grants: WebPermissionGrant[];
}

export interface MyPermissions {
  permissions: string[];
  restrictedScreens: string[];
  isAdmin: boolean;
}

export interface UserBrief {
  id: string;
  userName?: string;
  department?: string;
}

function toGrant(g: any): WebPermissionGrant {
  return {
    id: g.id,
    permCode: g.perm_code,
    grantType: g.grant_type,
    grantValue: g.grant_value,
    createdDate: g.created_date,
    createdBy: g.created_by,
  };
}

function toPermission(p: any): WebPermission {
  return {
    permCode: p.perm_code,
    permType: p.perm_type,
    name: p.name,
    category: p.category,
    description: p.description,
    orderIdx: p.order_idx ?? 0,
    grants: (p.grants ?? []).map(toGrant),
  };
}

function form(data: Record<string, string | number | null | undefined>) {
  const fd = new FormData();
  Object.entries(data).forEach(([k, v]) => {
    if (v !== null && v !== undefined) fd.append(k, String(v));
  });
  return fd;
}

export async function fetchMyPermissions(
  userId: string,
  department?: string | null
): Promise<MyPermissions> {
  const res = await axios.post(
    `${BASE}/my_permissions`,
    form({ user_id: userId, department: department || undefined })
  );
  return {
    permissions: res.data.permissions ?? [],
    restrictedScreens: res.data.restricted_screens ?? [],
    isAdmin: !!res.data.is_admin,
  };
}

export async function fetchPermissionList(): Promise<WebPermission[]> {
  const res = await axios.get(`${BASE}/permissions`);
  return (res.data as any[]).map(toPermission);
}

export async function savePermission(
  perm: Omit<WebPermission, "grants">,
  requesterId: string
): Promise<WebPermission> {
  const res = await axios.post(
    `${BASE}/save_permission`,
    {
      perm_code: perm.permCode,
      perm_type: perm.permType,
      name: perm.name,
      category: perm.category || null,
      description: perm.description || null,
      order_idx: perm.orderIdx ?? 0,
    },
    { params: { requester_id: requesterId } }
  );
  return toPermission(res.data);
}

export async function deletePermission(permCode: string, requesterId: string) {
  await axios.post(
    `${BASE}/delete_permission`,
    form({ perm_code: permCode, requester_id: requesterId })
  );
}

export async function addGrant(
  permCode: string,
  grantType: GrantType,
  grantValue: string,
  requesterId: string
): Promise<WebPermissionGrant> {
  const res = await axios.post(
    `${BASE}/add_grant`,
    form({
      perm_code: permCode,
      grant_type: grantType,
      grant_value: grantValue,
      requester_id: requesterId,
    })
  );
  return toGrant(res.data);
}

export async function deleteGrant(grantId: number, requesterId: string) {
  await axios.post(
    `${BASE}/delete_grant`,
    form({ grant_id: grantId, requester_id: requesterId })
  );
}

export async function fetchUsers(): Promise<UserBrief[]> {
  const res = await axios.get(`${BASE}/users`);
  return (res.data as any[]).map((u) => ({
    id: u.id,
    userName: u.user_name,
    department: u.department,
  }));
}

export async function fetchDepartments(): Promise<string[]> {
  const res = await axios.get(`${BASE}/departments`);
  return res.data as string[];
}
