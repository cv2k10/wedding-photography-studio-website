export type BookingInput = {
  coupleName: string;
  phone: string;
  wechat: string;
  weddingDate: string;
  packageId: number | null;
  city: string;
  message: string;
};

export type BookingParseResult = { ok: true; data: BookingInput } | { ok: false; error: string };

const PHONE_PATTERN = /^\+?[\d\s-]{6,20}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function readText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function isValidIsoDate(value: string) {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** 校验并清洗预约表单数据（服务端最终校验，不依赖前端） */
export function parseBookingInput(raw: unknown): BookingParseResult {
  if (typeof raw !== "object" || raw === null) {
    return { ok: false, error: "提交的数据格式不正确" };
  }

  const body = raw as Record<string, unknown>;
  const coupleName = readText(body.coupleName, 40);
  const phone = readText(body.phone, 20);
  const wechat = readText(body.wechat, 40);
  const weddingDate = readText(body.weddingDate, 10);
  const city = readText(body.city, 60);
  const message = readText(body.message, 1000);

  let packageId: number | null = null;
  const rawPackageId = body.packageId;
  if (rawPackageId !== undefined && rawPackageId !== null && rawPackageId !== "") {
    if (typeof rawPackageId !== "string" && typeof rawPackageId !== "number") {
      return { ok: false, error: "所选套系无效" };
    }
    const parsed = Number(rawPackageId);
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      return { ok: false, error: "所选套系无效" };
    }
    packageId = parsed;
  }

  if (coupleName.length < 2) {
    return { ok: false, error: "请填写新人姓名（至少 2 个字）" };
  }
  if (!PHONE_PATTERN.test(phone)) {
    return { ok: false, error: "请填写正确的联系电话" };
  }
  if (!isValidIsoDate(weddingDate)) {
    return { ok: false, error: "请选择预计婚期" };
  }

  return {
    ok: true,
    data: { coupleName, phone, wechat, weddingDate, packageId, city, message },
  };
}
