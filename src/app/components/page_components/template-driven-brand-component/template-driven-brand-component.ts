import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal, Signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../custom_modules/material/material-module';
import { PageEvent } from '@angular/material/paginator';
import { DashboardModeEnum } from '../../../config/enums/dashboardModeEnum';
import { BrandModel } from '../../../models/api_models/brandModel';
import { BrandService } from '../../../services/api_services/brandService';

@Component({
  selector: 'app-template-driven-brand-component',
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './template-driven-brand-component.html',
  styleUrl: './template-driven-brand-component.scss',
})
export class TemplateDrivenBrandComponent {

  
  // ======================================================
  // STATE
  // ======================================================
  brands = signal<BrandModel[]>([]);
  loading!: Signal<boolean>;

  pageNumber = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);

  // ======================================================
  // FORM STATE
  // ======================================================
  brandName = signal('');
  searchText = signal('');

  selectedBrandId = signal<number | null>(null);
  formMode = signal<DashboardModeEnum>(DashboardModeEnum.CREATE);

  displayedColumns = ['brandName', 'createdAt', 'actions'];

  // ======================================================
  // MODE HELPERS
  // ======================================================
  isEditMode = computed(() => this.formMode() === DashboardModeEnum.EDIT);
  isViewMode = computed(() => this.formMode() === DashboardModeEnum.VIEW);

  // ======================================================
  // VALIDATION
  // ======================================================
  isFormValid = computed(() => {
    const name = this.brandName().trim();
    const lettersOnlyRegex = /^[A-Za-z\s]+$/;

    return name.length > 0 && lettersOnlyRegex.test(name);
  });

  // ======================================================
  // DERIVED
  // ======================================================
  totalPages = computed(() =>
    Math.ceil(this.totalCount() / this.pageSize())
  );

  requestParams = computed(() => ({
    pageNumber: this.pageNumber(),
    pageSize: this.pageSize(),
    searchKey: this.searchText() || undefined,
  }));

  // ======================================================
  // CONSTRUCTOR
  // ======================================================
  constructor(
    private brandService: BrandService,
  ) {
    this.loading = this.brandService.loading;

    effect(() => {
      this.loadBrands();
    });
  }

  // ======================================================
  // LOADERS
  // ======================================================
  private loadBrands(): void {
    const params = this.requestParams();

    this.brandService
      .getBrandPaged(
        params.pageNumber,
        params.pageSize,
        params.searchKey
      )
      .subscribe(res => {
        console.log(res);
        this.brands.set(res.items);
        this.totalCount.set(res.totalCount);
      });
  }

  // ======================================================
  // FORM LOADER
  // ======================================================
  private loadToForm(
    brand: BrandModel,
    mode: DashboardModeEnum
  ): void {
    this.selectedBrandId.set(brand.brandID ?? null);
    this.brandName.set(brand.brandName);
    this.formMode.set(mode);
  }

  private resetForm(): void {
    this.brandName.set('');
    this.selectedBrandId.set(null);
    this.formMode.set(DashboardModeEnum.CREATE);
  }

  // ======================================================
  // CRUD OPERATIONS
  // ======================================================
  view(brand: BrandModel): void {
    this.loadToForm(brand, DashboardModeEnum.VIEW);
  }

  edit(brand: BrandModel): void {
    this.loadToForm(brand, DashboardModeEnum.EDIT);
  }

  onSubmit(): void {
    if (this.isEditMode()) {
      this.update();
    } else {
      this.save();
    }
  }

  save(): void {
    if (!this.isFormValid()) return;
    const payload: BrandModel = {
      brandName: this.brandName(),
    };

    this.brandService.create(payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadBrands();
      }
    });
  }

  update(): void {
    if (!this.isFormValid() || !this.selectedBrandId())
      return;

    const payload: BrandModel = {
      brandID: this.selectedBrandId()!,
      brandName: this.brandName(),
    };

    this.brandService.update(payload.brandID!, payload).subscribe({
      next: () => {
        this.resetForm();
        this.loadBrands();
      }
    });
  }

  delete(brand: BrandModel): void {
    this.brandService.delete(brand.brandID!).subscribe({
      next: () => {
        this.loadBrands();
      }
    });
  }

  cancel(): void {
    this.resetForm();
  }

  // ======================================================
  // HANDLERS
  // ======================================================
  onSearch(text: string): void {
    this.pageNumber.set(1);
    this.searchText.set(text);
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }
}
