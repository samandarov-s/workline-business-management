from app.routers.user import router as user_router
from app.routers.auth import router as auth_router
from app.routers.task import router as task_router
from app.routers.project import router as project_router
from app.routers.inventory import router as inventory_router
from app.routers.inventory_item import router as inventory_item_router
from app.routers.inventory_transaction import router as inventory_transaction_router
from app.routers.financial_record import router as financial_record_router
from app.routers.report import router as report_router
from app.routers.time_entry import router as time_entry_router
from app.routers.accounting import router as accounting_router
from app.routers.reporting import router as reporting_router

__all__ = [
    "user_router", 
    "auth_router", 
    "task_router", 
    "project_router",
    "inventory_router",
    "inventory_item_router", 
    "inventory_transaction_router",
    "financial_record_router",
    "report_router",
    "time_entry_router",
    "accounting_router",
    "reporting_router"
]




